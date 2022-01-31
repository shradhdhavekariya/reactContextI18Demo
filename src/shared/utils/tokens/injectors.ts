import { useMemo } from 'react'
import { set } from 'lodash'
import { combineLatest, Observable } from 'rxjs'
import { switchMap, throttleTime } from 'rxjs/operators'
import useDeepMemo from 'src/hooks/useDeepMemo'
import useObservable from 'src/shared/hooks/useObservable'
import balanceOf$ from 'src/shared/observables/balanceOf'
import contractOf$ from 'src/shared/observables/contractOf'
import allowanceOf$ from 'src/shared/observables/allowanceOf'
import exchangeRateOf$ from 'src/shared/observables/exchangeRateOf'
import { cpk$ } from 'src/cpk'
import { Obj } from 'src/shared/types'
import { AbstractToken } from 'src/shared/types/tokens'
import { OBSERVABLE_THROTTLE_INTERVAL } from 'src/shared/consts/time'

type Injector<T extends Obj = Obj, O = unknown> = (
  token: T,
) => Record<string, Observable<O>>

/**
 * A hook to add properties to tokens array using injection functions (see below)
 * @param origin the original tokens array
 * @param injectors the injector functions
 * @returns tokens array with injected properties
 */
export const useInjections = <Src extends Obj>(
  origin: Src[],
  injectors: Injector<Src>[],
) => {
  const injections = useObservable(
    useDeepMemo(
      () =>
        combineLatest(
          origin.map((item) =>
            combineLatest({
              ...injectors.reduce(
                (prev, injector) => ({
                  ...prev,
                  ...injector(item),
                }),
                {} as Record<string, Observable<unknown>>,
              ),
            }),
          ),
        ).pipe(
          throttleTime(OBSERVABLE_THROTTLE_INTERVAL, undefined, {
            trailing: true,
            leading: false,
          }),
        ),
      [injectors, origin],
    ),
  )

  return useMemo(
    () =>
      origin.map((item, idx) => {
        const injection = injections?.[idx]

        if (injection) {
          return Object.keys(injection).reduce(
            (res, path) => set(res, path, injection[path]),
            item,
          )
        }

        return item
      }),
    [injections, origin],
  )
}

export const injectBalance = (account?: string | null, path = 'balance') => (
  token: Pick<AbstractToken, 'id'>,
) => ({
  [path]: balanceOf$(account)(token),
})

export const injectCpkAllowance = (
  account?: string | null,
  path = 'cpkAllowance',
) => (token: Pick<AbstractToken, 'id'>) => ({
  [path]: cpk$.pipe(
    switchMap((cpk) => allowanceOf$(account, cpk?.address)(token)),
  ),
})

export const injectContract = (path = 'contract') => (
  token: Pick<AbstractToken, 'id' | 'address'>,
) => ({
  [path]: contractOf$()(token),
})

export const injectExchangeRate = (path = 'exchangeRate') => (
  token: Pick<AbstractToken, 'id' | 'address'>,
) => ({
  [path]: exchangeRateOf$()(token),
})
