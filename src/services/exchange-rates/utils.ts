import api from '../api'
import { ExchangeRateMap } from './types'
import { rinkebyToMainnetMap } from './consts'

export const getStoredExchangeRates = () => {
  const rawExchangeRateMap = localStorage.getItem('exchange-rates')

  let exchangeRateMap: ExchangeRateMap = {}

  if (rawExchangeRateMap) {
    try {
      exchangeRateMap = JSON.parse(rawExchangeRateMap)
    } catch {
      //
    }
  }

  return exchangeRateMap
}

const getTokenMainnetAddress = (address: string) =>
  rinkebyToMainnetMap?.[address.toLowerCase()] || address.toLowerCase()

export const getExchangeRates = async (tokens: string[]) => {
  try {
    const pricesResponse = await api.getPricesV2(
      tokens.map(getTokenMainnetAddress),
    )
    const { prices } = pricesResponse?.attributes || {}
    const timestamp = Date.now()

    return tokens.reduce(
      (m: ExchangeRateMap, tokenAddress: string) => ({
        ...m,
        [tokenAddress]: {
          exchangeRate:
            prices?.[getTokenMainnetAddress(tokenAddress)]?.usd || undefined,
          timestamp,
        },
      }),
      {},
    ) as ExchangeRateMap
  } catch {
    return {}
  }
}
