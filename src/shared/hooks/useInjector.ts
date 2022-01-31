import { useCallback, useMemo } from 'react'
import { asyncScheduler, combineLatest, Observable, of } from 'rxjs'
import { defaultIfEmpty, throttleTime } from 'rxjs/operators'
import { Obj } from '../types'
import useObservable from './useObservable'
import Observed from '../types/observables/observed'

type InjectionMap = Record<string, Observable<unknown>>

type AdditionalProps<M extends InjectionMap> = {
  [k in keyof M]: Observed<M[k]>
}

type Injected<T, M extends InjectionMap> = T & AdditionalProps<M>

const createEmptyObject = <
  T extends Record<string, unknown> = Record<string, unknown>
>(
  keys: string[],
) =>
  keys.reduce(
    (acc, key) => ({
      ...acc,
      [key]: null,
    }),
    {} as T,
  )

const useInjector = <
  T extends Obj = Obj,
  M extends InjectionMap = InjectionMap
>(
  injectionMap?: M,
  source?: T,
  throttleInterval = 1000,
): T | Injected<T, M> | undefined => {
  const additionalProps = useObservable<AdditionalProps<M> | undefined>(
    useCallback(() => {
      if (injectionMap) {
        return combineLatest(
          Object.keys(injectionMap).reduce(
            (prev, key) => ({
              ...prev,
              [key]: injectionMap[key].pipe(defaultIfEmpty(null)),
            }),
            {},
          ),
        ).pipe(
          throttleTime(throttleInterval, asyncScheduler, { trailing: true }),
        )
      }

      return of(
        createEmptyObject<AdditionalProps<M>>(Object.keys(injectionMap || {})),
      )
    }, [injectionMap, throttleInterval]),
    useMemo(
      () =>
        createEmptyObject<AdditionalProps<M>>(Object.keys(injectionMap || {})),
      [injectionMap],
    ),
  )

  return useMemo(() => source && { ...source, ...additionalProps }, [
    additionalProps,
    source,
  ])
}

export default useInjector
