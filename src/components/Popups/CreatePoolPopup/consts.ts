import { big } from 'src/shared/utils/big-helpers'
import { NewPoolSchema } from './types'

export const MIN_FEE = big(1).div(10 ** 6)
export const MAX_FEE = big(1).div(10)
export const MIN_WEIGHT = big(1)
export const MAX_WEIGHT = big(50)
export const MAX_TOTAL_WEIGHT = big(50)
export const MIN_BALANCE = big(1).div(10 ** 12)
export const DEFAULT_SWAP_FEE = 0.0015
export const DEFAULT_TOKEN_WEIGHT = 1

export const newPoolInitialValues: NewPoolSchema = {
  swapFee: DEFAULT_SWAP_FEE,
  assets: [],
}
