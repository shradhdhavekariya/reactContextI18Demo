import { recursiveRound } from '../index'
import { BigUnit } from '../../enums'

const unitValues = Object.values(BigUnit).filter(
  (value) => !Number.isNaN(+value),
) as number[]

export const formatBigInt = (integer: number, base = 1) => {
  const unit = unitValues.find((u) => integer >= u) || 1
  const prettyInt = recursiveRound(integer / unit, { base })

  return prettyInt + (BigUnit[unit] || '')
}
