import BaseResponse from './base.response'

interface ExchangePrice {
  currency: string
  price: number
}

interface ExchangeAttributes {
  base: string
  prices: ExchangePrice[]
}

export type ExchangePricesResponse = BaseResponse<ExchangeAttributes>

interface TokenPrice {
  [currency: string]: number
}

interface ExchangePriceV2 {
  [tokenAddress: string]: TokenPrice
}

interface ExchangeAttributesV2 {
  prices: ExchangePriceV2
}

export type ExchangePriceResponseV2 = BaseResponse<ExchangeAttributesV2>
