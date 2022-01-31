import { BigSource } from 'big.js'
import { AllowanceStatus } from '../enums'
import { big } from './big-helpers'

export const compareAllowanceWithBalance = (
  tokenBalance: BigSource,
  tokenAllowance: BigSource,
): AllowanceStatus => {
  const bigAllowance = big(tokenAllowance)

  return (
    (bigAllowance.eq(0) && AllowanceStatus.NOT_ALLOWED) ||
    (bigAllowance.gte(tokenBalance) && AllowanceStatus.INFINITE) ||
    AllowanceStatus.LIMITED
  )
}
