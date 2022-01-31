import { BigSource } from 'big.js'
import { big } from '../big-helpers'
import { recursiveRound } from '../recursive-round'

export interface AutoRoundOptions {
  minDecimals?: number
  accuracy?: number
  maxRounds?: number
  returnBig?: boolean
  maxDecimals?: number
}

const autoRound = (num: BigSource, options: AutoRoundOptions = {}) => {
  const {
    minDecimals = 2,
    accuracy = 3,
    returnBig = false,
    maxRounds = 100,
    maxDecimals = 8,
  } = options

  const signal = big(num).gte(0) ? 1 : -1

  const log = big(num).eq(0) ? 0 : Math.log10(big(num).abs().toNumber())

  const base =
    log > 0
      ? minDecimals
      : Math.max(
          Math.min(Math.round(-log + accuracy), maxDecimals),
          minDecimals,
        )

  return (
    signal *
    recursiveRound(big(num).abs(), {
      base,
      returnBig,
      maxRounds,
    })
  )
}

export default autoRound
