import { difference, get, isEqual, map as _map, sortBy } from 'lodash'
import { BigNumber } from 'ethers'
import {
  BehaviorSubject,
  concat,
  fromEvent,
  interval,
  merge,
  of,
  Subject,
  timer,
} from 'rxjs'
import {
  scan,
  distinctUntilChanged,
  shareReplay,
  filter,
  startWith,
  throttleTime,
  bufferToggle,
  switchMapTo,
  take,
  repeatWhen,
  concatMap,
  map,
  pairwise,
  skip,
} from 'rxjs/operators'
import { createWatcher } from '@makerdao/multicall'
import { propEquals, propNotIn } from 'src/shared/utils/collection/filters'
import configForNetwork$, { getCurrentConfig } from './configForNetwork'
import { toBehaviorSubject, waitForValue } from '../utils/rxjs'
import { INITIAL_POLL_INTERVAL, POLL_INTERVAL } from '../consts/time'
import { account$, networkId$, readyState$ } from '../web3'

const CALL_KEY_PATH = 'returns.0.0'

interface Call {
  target: string
  call: [string, ...unknown[]]
  returns: [[string, ...unknown[]]]
}

interface Update<T = unknown> {
  type: string
  value: T
}

interface WatcherConfig {
  rpcUrl: string
  multicallAddress: string
}

interface WatcherConfigs {
  rpcUrl: string
  multicallAddress: string
  interval: number
  errorRetryWait: number
}

interface Watcher {
  tap: (tapper: (calls: Call[]) => Call[]) => Promise<void>
  start: () => Promise<void>
  stop: () => Promise<void>
  batch: () => {
    subscribe: <T = unknown>(
      subscriber: (updates: Update<T>[]) => void,
    ) => { unsub: () => void }
  }
  recreate: (calls: Call[], config: WatcherConfig) => Promise<unknown>
  onNewBlock: (subscriber: (newBlockNumber: number) => void) => void
  subscribe: <T = unknown>(
    subscriber: (updates: Update<T>) => void,
  ) => { unsub: () => void }
  awaitInitialFetch: () => Promise<unknown>
  unsub?: () => void
}

export const watcherReady = new BehaviorSubject<Promise<Watcher> | null>(null)

let updateTypes: string[] = []

const cacheSrc = new BehaviorSubject<Update[] | null>([])

const cache = cacheSrc.pipe(
  distinctUntilChanged(isEqual),
  scan((acc, curr) => {
    if (curr === null) {
      return []
    }

    return sortBy(
      acc.filter(propNotIn('type', _map(curr, 'type'))).concat(curr),
      'type',
    )
  }, [] as Update[]),
  distinctUntilChanged<Update[]>(isEqual),
  shareReplay(1),
)

const calls$ = new Subject<Call>()

/**
 * Every time the network changes, throttle to 5 times the INITIAL_POLL_INTERVAL
 * then emit INITIAL_POLL_INTERVAL five times within an interval of INITIAL_POLL_INTERVAL
 * then emit POLL_INTERVAL within an interval of POLL_INTERVAL
 */
const dynamicPollInterval$ = merge(
  networkId$.pipe(
    startWith(0),
    throttleTime(INITIAL_POLL_INTERVAL * 5, undefined, {
      leading: true,
      trailing: false,
    }),
    switchMapTo(
      concat(
        of(INITIAL_POLL_INTERVAL).pipe(
          repeatWhen(() => interval(INITIAL_POLL_INTERVAL).pipe(take(4))),
        ),
        of(POLL_INTERVAL).pipe(repeatWhen(() => interval(POLL_INTERVAL))),
      ),
    ),
  ),
)

const throttledCalls$ = toBehaviorSubject(
  calls$.pipe(
    bufferToggle(dynamicPollInterval$, timer),
    filter((arr) => !!arr.length),
  ),
  [],
)

const getConfigForNetwork = (newConfig = getCurrentConfig()) => ({
  ...newConfig,
  interval: POLL_INTERVAL,
  errorRetryWait: POLL_INTERVAL,
})

/**
 * If watcher exists, recreate it. Otherwise, create it.
 *
 * @param options
 * @returns Promise<Watcher>
 */
const createWatcherInstance = async (options?: Partial<WatcherConfigs>) => {
  const initialCalls = throttledCalls$.getValue()
  const configs = { ...getConfigForNetwork(), ...options }
  const existingWatcher = await watcherReady.getValue()

  if (existingWatcher) {
    await existingWatcher.recreate(initialCalls, configs)

    return existingWatcher
  }

  const watcher = createWatcher(initialCalls, configs) as Watcher

  await waitForValue(readyState$, true)

  await watcher.start()

  await watcher.awaitInitialFetch()

  configForNetwork$.subscribe((newNetworkConfig) => {
    const newConfig = getConfigForNetwork(newNetworkConfig)

    cacheSrc.next(null)

    watcher.recreate([], newConfig)
  })

  account$.pipe(skip(1), pairwise()).subscribe(([oldAccount]) => {
    if (oldAccount) {
      watcher.tap((calls) =>
        calls.filter(
          (call) =>
            !get(call, CALL_KEY_PATH)
              ?.toLowerCase()
              .includes(oldAccount?.toLowerCase()),
        ),
      )

      const updates = cacheSrc.getValue()

      const affectedUpdates =
        (updates?.filter(
          (update) =>
            !update.type.toLowerCase().includes(oldAccount?.toLowerCase()),
        ) as Update[]) || []

      const unaffectedUpdates =
        (updates?.filter((update) =>
          update.type.toLowerCase().includes(oldAccount?.toLowerCase()),
        ) as Update[]) || []

      cacheSrc.next([
        ...unaffectedUpdates,
        ...affectedUpdates.map((update) => ({
          ...update,
          value: null,
        })),
      ])
    }
  })

  return watcher
}

const getWatcher = async () => {
  const watcher = await watcherReady.getValue()

  if (!watcher) {
    watcherReady.next(
      createWatcherInstance({ interval: INITIAL_POLL_INTERVAL }),
    )

    // Recreate watcher when dynamicPollInterval changes
    dynamicPollInterval$
      .pipe(
        distinctUntilChanged(),
        concatMap((pollInterval) =>
          createWatcherInstance({ interval: pollInterval }),
        ),
      )
      .subscribe()

    fromEvent(document, 'visibilitychange').subscribe(async () => {
      const currentWatcher = await watcherReady.getValue()

      if (currentWatcher) {
        if (document.visibilityState === 'hidden') {
          currentWatcher.stop()
        } else {
          currentWatcher.start()
        }
      }
    })
  }

  return watcherReady.getValue() as Promise<Watcher>
}

throttledCalls$.subscribe(async (newCalls: Call[]) => {
  const watcher = await getWatcher()

  await watcher.tap((prevCalls) => {
    return [...prevCalls, ...newCalls]
  })

  if (watcher.unsub) {
    watcher.unsub()
  }
  const { unsub } = watcher
    .batch()
    .subscribe((updates) => cacheSrc.next(updates))

  watcher.unsub = unsub
})

const addCalls = async (...calls: Call[]) => {
  const newCalls = calls.filter(propNotIn(CALL_KEY_PATH, updateTypes))

  if (newCalls.length) {
    updateTypes = updateTypes.concat(_map(newCalls, CALL_KEY_PATH))

    newCalls.forEach((newCall) => calls$.next(newCall))
  }
}

export const removeCalls = async (...types: string[]) => {
  const watcher = await getWatcher()

  updateTypes = difference(updateTypes, types)

  await watcher.tap((prevCalls) =>
    prevCalls.filter(propNotIn(CALL_KEY_PATH, types)),
  )

  if (watcher.unsub) {
    watcher.unsub()
  }

  const { unsub } = watcher
    .batch()
    .subscribe((updates) => cacheSrc.next(updates))

  watcher.unsub = unsub
}

export function observeCall(
  target: string,
  call: [string, ...unknown[]],
  type: string,
) {
  addCalls({
    target,
    call,
    returns: [[type]],
  })

  return cache.pipe(
    map(
      (updates) => updates.find(propEquals('type', type))?.value as BigNumber,
    ),
    distinctUntilChanged(isEqual),
  )
}

export const refresh = async () => {
  const watcher = await watcherReady.getValue()

  watcher?.stop()
  watcher?.start()

  return watcher?.awaitInitialFetch()
}

export const invalidateKeys = (...keys: string[]) => {
  const prevUpdates = cacheSrc.getValue()

  if (prevUpdates) {
    cacheSrc.next(
      prevUpdates.map((update) =>
        keys.includes(update.type) ? { ...update, value: null } : update,
      ),
    )
  }
}
