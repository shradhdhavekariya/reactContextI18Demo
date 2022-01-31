import { BehaviorSubject, interval, Subject, from, merge } from 'rxjs'
import {
  debounceTime,
  distinct,
  filter,
  map,
  sample,
  scan,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators'
import { ExchangeRateLifetime, initialExchangeRates } from './config'
import { getExchangeRates } from './utils'

export const initialTokens$ = from(Object.keys(initialExchangeRates))

export const tokenPortal$ = new Subject<string>()

export const tokens$ = merge(initialTokens$, tokenPortal$).pipe(
  distinct(),
  scan((acc, curr) => [...acc, curr], [] as string[]),
)

export const exchangeRates$ = new BehaviorSubject(initialExchangeRates)

export const refresher$ = tokens$.pipe(sample(interval(ExchangeRateLifetime)))

export const calls$ = merge(tokens$, refresher$).pipe(
  withLatestFrom(exchangeRates$),
  filter(([tokens, lastExchangeRates]) =>
    tokens.some(
      (token) =>
        !lastExchangeRates[token] ||
        lastExchangeRates[token].timestamp < Date.now() - 10000,
    ),
  ),
  map(([tokens]) => tokens),
  debounceTime(500),
  switchMap(getExchangeRates),
)

calls$.subscribe((exchangeRates) => {
  localStorage.setItem('exchange-rates', JSON.stringify(exchangeRates))
  exchangeRates$.next(exchangeRates)
})
