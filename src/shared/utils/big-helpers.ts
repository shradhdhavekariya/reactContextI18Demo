import Big, { BigSource } from 'big.js'
import { isEqual } from 'lodash'
import either from './either'

export const big = (value?: BigSource) =>
  new Big(value && Number(value) ? value : 0)

export const isBigSource = (value: unknown): value is BigSource =>
  either(() => {
    Big(value as BigSource)
    return true
  }, false)

export const ZERO = big(0)

export const B_TWO = big(2)

export const B_TEN = big(10)

export const safeDiv = (input?: BigSource, divider?: BigSource) =>
  input && divider && !big(divider).eq(0) ? big(input).div(big(divider)) : ZERO

export const idiv = (input?: BigSource, divider?: BigSource) =>
  safeDiv(input, divider).round(0, 0)

export const BONE = B_TEN.pow(18)

// Leave some room for bignumber rounding errors
export const MAX_IN_RATIO = BONE.times(big(0.499999999999999))

// Leave some room for bignumber rounding errors
export const MAX_OUT_RATIO = BONE.times(big(0.333333333333333))

const BPOW_PRECISION = idiv(BONE, B_TEN.pow(10))

export const scale = (input: BigSource, decimalPlaces: number): Big =>
  B_TEN.pow(decimalPlaces).times(big(input))

export const bdiv = (a: BigSource, b: BigSource): Big => {
  const bigA = big(a)
  const bigB = big(b)
  const c0 = bigA.times(BONE)
  const c1 = c0.plus(bigB.div(B_TWO))
  return idiv(c1, bigB)
}

const btoi = (a: BigSource): Big => idiv(a, BONE)

export const bmul = (a: BigSource, b: BigSource): Big => {
  const bigA = big(a)
  const bigB = big(b)
  const c0 = bigA.times(bigB)
  const c1 = c0.plus(BONE.div(B_TWO))
  return btoi(c1)
}

const bfloor = (a: BigSource): Big => btoi(a).times(BONE)

const bpowi = (a: BigSource, n: BigSource): Big => {
  let bigA = big(a)
  let bigN = big(n)
  let z = !bigN.mod(B_TWO).eq(ZERO) ? bigA : BONE

  for (bigN = idiv(bigN, B_TWO); !bigN.eq(ZERO); bigN = idiv(bigN, B_TWO)) {
    bigA = bmul(bigA, bigA)
    if (!bigN.mod(B_TWO).eq(ZERO)) {
      z = bmul(z, a)
    }
  }

  return z
}

const bsubSign = (a: BigSource, b: BigSource): { res: Big; bool: boolean } => {
  const bigA = big(a)
  const bigB = big(b)

  return bigA.gte(bigB)
    ? {
        res: bigA.minus(bigB),
        bool: false,
      }
    : {
        res: bigB.minus(bigA),
        bool: true,
      }
}

const bpowApprox = (
  base: BigSource,
  exp: BigSource,
  precision: BigSource,
): Big => {
  const a = exp
  const { res: x, bool: xneg } = bsubSign(base, BONE)
  let term = BONE
  let sum = term
  let negative = false

  // eslint-disable-next-line no-plusplus
  for (let i = 1; term.gte(precision); i++) {
    const bigK = big(i).times(BONE)
    const { res: c, bool: cneg } = bsubSign(a, bigK.minus(BONE))

    term = bmul(term, bmul(c, x))
    term = bdiv(term, bigK)

    if (term.eq(ZERO)) break

    if (xneg || cneg) negative = !negative

    sum = negative ? sum.minus(term) : sum.plus(term)
  }

  return sum
}

export const bpow = (base: BigSource, exp: BigSource): Big => {
  const whole = bfloor(exp)
  const remain = big(exp).minus(whole)
  const wholePow = bpowi(base, btoi(whole))
  if (remain.eq(ZERO)) {
    return wholePow
  }

  const partialResult = bpowApprox(base, remain, BPOW_PRECISION)
  return bmul(wholePow, partialResult)
}

export const calcOutGivenIn = (
  tokenBalanceIn: BigSource,
  tokenWeightIn: BigSource,
  tokenBalanceOut: BigSource,
  tokenWeightOut: BigSource,
  tokenAmountIn: BigSource,
  swapFee: BigSource,
): Big => {
  const weightRatio = bdiv(tokenWeightIn, tokenWeightOut)

  const adjustedIn = bmul(tokenAmountIn, BONE.minus(swapFee))

  const y = bdiv(tokenBalanceIn, big(tokenBalanceIn).plus(adjustedIn))

  const foo = bpow(y, weightRatio)

  const bar = BONE.minus(foo)

  // Token Amount Out
  return bmul(tokenBalanceOut, bar)
}

export const calcInGivenOut = (
  tokenBalanceIn: BigSource,
  tokenWeightIn: BigSource,
  tokenBalanceOut: BigSource,
  tokenWeightOut: BigSource,
  tokenAmountOut: BigSource,
  swapFee: BigSource,
) => {
  const weightRatio = bdiv(tokenWeightOut, tokenWeightIn)

  const diff = big(tokenBalanceOut).minus(tokenAmountOut)

  const y = bdiv(tokenBalanceOut, diff)

  const foo = bpow(y, weightRatio).minus(BONE)

  // tokenAmountIn
  return bdiv(bmul(tokenBalanceIn, foo), BONE.minus(swapFee))
}

export const toWei = (val: BigSource): Big => scale(val, 18)

export const normalize = (bigBalance: BigSource, decimals = 0): Big =>
  safeDiv(bigBalance, 10 ** decimals)

export const denormalize = (bigBalance: BigSource, decimals = 0): Big =>
  big(bigBalance).times(10 ** decimals)

export const sort = (bigNumbers: BigSource[], mode = 'asc') =>
  bigNumbers.sort(
    (a: BigSource, b: BigSource) =>
      big(a).cmp(b) * (Number(mode === 'desc') ? -1 : 1),
  )

export const min = (firstNumber: BigSource, ...bigNumbers: BigSource[]): Big =>
  big(sort([firstNumber, ...bigNumbers])[0])

export const max = (firstNumber: BigSource, ...bigNumbers: BigSource[]): Big =>
  big(sort([firstNumber, ...bigNumbers], 'desc')[0])

export const compareBig = (
  first: Big | null | undefined,
  second: Big | null | undefined,
) => isEqual(first, second) || (!!first && !!second && first.eq(second))

// eslint-disable-next-line @typescript-eslint/no-shadow
export const isBetween = (min: BigSource, max: BigSource) => (value: unknown) =>
  ((typeof value === 'string' && value !== '') ||
    (typeof value === 'number' && !Number.isNaN(value)) ||
    value instanceof Big) &&
  big(min).lte(value) &&
  big(max).gte(value)

// eslint-disable-next-line @typescript-eslint/no-shadow
export const isLessThan = (max: BigSource) => (value: BigSource) =>
  big(value).lte(max)

// eslint-disable-next-line @typescript-eslint/no-shadow
export const isGreaterThan = (min: BigSource) => (value: BigSource) =>
  big(value).gte(min)
