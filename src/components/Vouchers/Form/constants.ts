export const AVAILABLE_FIATS = [
  {
    symbol: '€',
    limit: 500,
    code: 'EUR',
  },
  {
    symbol: '$',
    limit: 600,
    code: 'USD',
  },
  {
    symbol: '£',
    limit: 450,
    code: 'GBP',
  },
]
export const PREDEFINED_AMOUNTS = [30, 50, 100]
export const PRICE_POLL_INTERVAL = 3000
export const AVAILABLE_CRYPTOCURRENCIES = [
  { symbol: 'wBTC', address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599' },
  { symbol: 'ETH', address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' },
]

export const LAST_SAVED_AMOUNT_KEY = 'Swarm.Vouchers.LastSavedAmount'
