import { getUnixTime } from 'date-fns'
import { UseSwapsOptions } from './types'

export const mapOptionsToVariables = ({
  tokenPair,
  dateFrom,
  userAddress,
  limit,
}: UseSwapsOptions) => ({
  filter: {
    tokenIn_in: tokenPair,
    tokenOut_in: tokenPair,
    timestamp_gt: dateFrom && getUnixTime(dateFrom),
    ...(userAddress && { userAddress: userAddress?.toLowerCase() }),
  },
  limit,
})
