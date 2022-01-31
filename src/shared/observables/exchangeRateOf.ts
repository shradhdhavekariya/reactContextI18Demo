import { distinctUntilChanged, map, startWith } from 'rxjs/operators'
import { exchangeRates$, tokenPortal$ } from 'src/services/exchange-rates'
import useObservable from '../hooks/useObservable'
import { AbstractToken } from '../types/tokens'

const exchangeRateOf$ = (initialValue?: number) => ({
  id,
}: Pick<AbstractToken, 'id'>) => {
  const key = id.toLowerCase()
  if (!exchangeRates$.value[key]) {
    tokenPortal$.next(key)
  }

  return exchangeRates$.pipe(
    map((rates) => rates[key]?.exchangeRate),
    startWith(initialValue),
    distinctUntilChanged(),
  )
}

export const useExchangeRateOf = (id: string, initialValue?: number) =>
  useObservable(exchangeRateOf$(initialValue)({ id }))

export default exchangeRateOf$
