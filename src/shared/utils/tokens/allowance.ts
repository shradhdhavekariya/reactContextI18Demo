import { BigSource } from 'big.js'
import { HasAllowance } from 'src/shared/types/tokens'
import { isLoading } from './balance'

export const allowanceLoading = (
  token: HasAllowance,
  account?: string | null,
  spender?: string | null,
) => isLoading(token.cpkAllowance, account, spender)

export const allowancesLoading = (
  tokens: HasAllowance[],
  account?: string | null,
  spender?: string | null,
) => tokens.some((token) => allowanceLoading(token, account, spender))

export const isLocked = (token: HasAllowance, amount: BigSource = 0) =>
  token.cpkAllowance?.lt(amount) ?? true

export const isUnlocked = (token: HasAllowance, amount: BigSource = 0) =>
  token.cpkAllowance?.gte(amount) ?? false
