import { getStoredExchangeRates } from './utils'

export const ExchangeRateLifetime = 1000 * 60

export const initialExchangeRates = getStoredExchangeRates()
