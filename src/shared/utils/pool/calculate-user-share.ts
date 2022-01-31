import Big, { BigSource } from 'big.js'
import { Share } from 'src/shared/types'

interface UserShare {
  userPoolTokenBalance: Big
  userPoolSharePercent: number // [0, 1]
}

export const calculateUserShare = (
  poolShares: Share[],
  totalShares: BigSource,
  cpkAddress?: string,
): UserShare => {
  const bigTotalShares = new Big(totalShares)
  if (!bigTotalShares.eq(0) && !!cpkAddress && !!poolShares.length) {
    const userShare = poolShares.find(
      (share) =>
        share.userAddress.id.toLowerCase() === cpkAddress.toLowerCase(),
    )
    const userPoolTokenBalance = new Big(userShare?.balance || 0)
    const userPoolSharePercent = userPoolTokenBalance
      .div(bigTotalShares)
      .toNumber()

    return {
      userPoolTokenBalance,
      userPoolSharePercent,
    }
  }
  return {
    userPoolTokenBalance: new Big(0),
    userPoolSharePercent: 0,
  }
}
