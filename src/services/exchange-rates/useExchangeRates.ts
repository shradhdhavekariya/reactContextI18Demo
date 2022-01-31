import { useLayoutEffect, useState } from 'react'
import { exchangeRates$, tokenPortal$ } from './observables'

export const useExchangeRates = (tokensAddresses: string[]) => {
  const [exchangeRates, setExchangeRates] = useState(exchangeRates$.value)

  useLayoutEffect(() => {
    const subscription = exchangeRates$.subscribe(setExchangeRates)

    tokensAddresses.map((address) => tokenPortal$.next(address))

    return () => {
      subscription.unsubscribe()
    }
  }, [tokensAddresses])

  return exchangeRates
}
