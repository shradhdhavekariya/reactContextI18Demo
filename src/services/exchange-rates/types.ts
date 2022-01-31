export interface TokenExchangeRate {
  exchangeRate: number | null | undefined
  timestamp: number
}

export type ExchangeRateMap = Record<string, TokenExchangeRate>
