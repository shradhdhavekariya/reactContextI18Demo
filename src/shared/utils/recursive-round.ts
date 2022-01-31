import Big, { BigSource } from 'big.js'

interface RoundingOptions {
  base?: number
  returnBig?: boolean
  maxRounds?: number
}

const numberToFixed = (num: number, digitsToSave: number) =>
  Math.round(num * 10 ** digitsToSave) / 10 ** digitsToSave

/**
 * Recursive rounding
 * @param {BigSource} num - value that you wanna to round
 * @param {object} [options] - optional configs
 * @param {number} [options.base=2] - amount of decimals to save
 * @param {boolean} [options.returnBig] - this option will affect on return type
 * @return {number | Big}
 */
export const recursiveRound = <T extends number | Big = number>(
  num: BigSource,
  options?: RoundingOptions,
): T => {
  const { base = 2, returnBig, maxRounds = 100 } = options || {}

  // numberToFixed is required to avoid such error: maximum call stack size exceeded
  const currentValue =
    typeof num === 'number' ? numberToFixed(num, 10) : new Big(num).toNumber()

  const dotIndex = `${currentValue}`.indexOf('.')
  const floatAmount = `${currentValue}`.length - dotIndex - 1

  if (floatAmount <= base || dotIndex === -1 || maxRounds === 0) {
    return <T>(returnBig ? new Big(num) : numberToFixed(currentValue, base))
  }

  const factor = 10 ** (floatAmount - 1)
  const result = returnBig
    ? new Big(num).times(factor).round(0, 1).div(factor)
    : Math.round((currentValue + Number.EPSILON) * factor) / factor

  return recursiveRound<T>(result, {
    base,
    returnBig,
    maxRounds: maxRounds - 1,
  })
}
