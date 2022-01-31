import { normalize } from '../utils/big-helpers'

export const DEFAULT_DECIMALS = 18
export const SPT_DECIMALS = 18
export const BONE = 10 ** SPT_DECIMALS
export const BALANCE_BUFFER = 0.01
export const MAX_OUT_RATIO = normalize(BONE / 3 + 1, SPT_DECIMALS)
export const MAX_IN_RATIO = normalize(BONE / 2, SPT_DECIMALS)
