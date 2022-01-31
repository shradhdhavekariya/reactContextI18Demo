import Big from 'big.js'
import { Pool } from 'src/shared/types'

export const calculateMarketCap = <P extends Pool>(pool: P) => {
  const validTokens = pool.tokens.filter(
    ({ exchangeRate, poolBalance }) => exchangeRate && poolBalance,
  )

  if (validTokens.length) {
    const [sumWeight, sumValue] = validTokens.reduce(
      (acc, token) => {
        const value = new Big(token.poolBalance || 0).times(
          token.exchangeRate || 0,
        )
        const sWeight = acc[0].plus(
          new Big(token.denormWeight || 0).div(pool.totalWeight).toNumber(),
        )
        const sValue = acc[1].plus(value)

        return [sWeight, sValue]
      },
      [new Big(0), new Big(0)],
    )

    if (sumWeight.gt(0)) {
      return sumValue.div(sumWeight).toNumber()
    }
  }

  // default liquidity
  return new Big(pool.liquidity || 0).toNumber()
}
