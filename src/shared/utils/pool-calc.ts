import Big, { BigSource } from 'big.js'
import { Pool } from 'src/shared/types/pool'
import { ExtendedPoolToken, PoolToken, Token } from 'src/shared/types/tokens'
import {
  BALANCE_BUFFER,
  MAX_OUT_RATIO,
  SPT_DECIMALS,
} from 'src/shared/consts/math'
import { ProtocolFee } from 'src/contracts/ProtocolFee'
import { getCurrentConfig } from 'src/shared/observables/configForNetwork'
import {
  big,
  denormalize,
  max,
  normalize,
  safeDiv,
  toWei,
  ZERO,
} from './big-helpers'

const { extraRewardAddress } = getCurrentConfig()

export const calcPoolTokensByRatio = (
  ratio: number,
  totalShares: string,
  tolerance = BALANCE_BUFFER,
): Big => {
  if (Number.isNaN(ratio) || ratio === 0) {
    return new Big(0)
  }

  const buffer = 100
  return normalize(
    new Big(ratio).times(toWei(totalShares)).minus(buffer),
    SPT_DECIMALS,
  ).times(1 - tolerance)
}

export const calcPoolOutGivenSingleIn = (
  amount: BigSource,
  token: ExtendedPoolToken,
  pool: Pool,
  slippage = BALANCE_BUFFER,
): Big => {
  if (
    !token.decimals ||
    new Big(amount).eq(0) ||
    new Big(pool.totalWeight).eq(0)
  ) {
    return new Big(0)
  }
  const tokenBalanceIn = denormalize(token?.poolBalance || 0, token.decimals)
  const poolSupply = denormalize(pool.totalShares, SPT_DECIMALS)
  const tokenAmountIn = denormalize(amount, token.decimals).round(0, 1)

  const normalizedWeight = new Big(token.denormWeight).div(pool.totalWeight)
  const zaz = new Big(1).minus(normalizedWeight).times(pool.swapFee)

  const tokenAmountInAfterFee = tokenAmountIn.times(new Big(1).minus(zaz))

  const newTokenBalanceIn = tokenBalanceIn.plus(tokenAmountInAfterFee)
  const tokenInRatio = newTokenBalanceIn.div(tokenBalanceIn)

  /**
   * @TODO use Binomial approximation
   * https://github.com/balancer-labs/pool-management-vue/blob/HEAD/src/helpers/math.ts#L101
   * https://docs.balancer.finance/core-concepts/protocol/index/approxing)
   * https://blog.openzeppelin.com/balancer-contracts-audit/
   * https://en.wikipedia.org/wiki/Binomial_approximation#Using_Taylor_Series
   */
  const poolRatio = tokenInRatio.toNumber() ** normalizedWeight.toNumber()

  const newPoolSupply = new Big(poolRatio).times(poolSupply)
  const poolAmountOut = newPoolSupply.minus(poolSupply)

  return normalize(poolAmountOut.times(1 - slippage), SPT_DECIMALS)
}

export const calcMaxRatio = (tokens: ExtendedPoolToken[]) => {
  if (!tokens.length) return 0

  const usdWeights = tokens.map(
    (token) =>
      (Number(token?.usdBalance) || 0) / (Number(token.denormWeight) || 1),
  )

  const minUsdWeight = Math.min(...usdWeights)

  const minUsdWeightTokenIndex = usdWeights.findIndex(
    (balance) => balance === minUsdWeight,
  )

  const { poolBalance: minPoolBalance, balance: minBalance } = tokens[
    minUsdWeightTokenIndex
  ]

  return safeDiv(minBalance ?? undefined, minPoolBalance).toNumber()
}

export const calcMaxAmountsIn = (
  tokens: ExtendedPoolToken[],
): Record<string, number> => {
  const maxRatio = calcMaxRatio(tokens)

  return tokens.reduce(
    (map, { address, poolBalance, usdBalance }) => ({
      ...map,
      [address]: (maxRatio || (!usdBalance ? 0 : 1)) * Number(poolBalance || 0),
    }),
    {},
  )
}

export const calcTokenAmountInByPoolAmountOut = (
  pool: Pool,
  poolAmountOut: BigSource,
  token: ExtendedPoolToken,
  tolerance = BALANCE_BUFFER,
) => {
  if (new Big(pool.totalShares).eq(0)) {
    return ZERO
  }

  return denormalize(token.poolBalance || 0, token.decimals)
    .times(denormalize(poolAmountOut, SPT_DECIMALS))
    .div(denormalize(pool.totalShares, SPT_DECIMALS))
    .times(1 + tolerance)
}

export const calcSingleTokenAmountInByPoolAmountOut = (
  pool: Pool,
  poolAmountOut: BigSource,
  token: ExtendedPoolToken,
  slippage = BALANCE_BUFFER,
) => {
  if (new Big(pool.totalShares).eq(0) || !token.weight || token.weight === 1) {
    return new Big(0)
  }

  const poolSupply = denormalize(pool.totalShares, SPT_DECIMALS)

  const newPoolSupply = poolSupply.plus(
    denormalize(poolAmountOut, SPT_DECIMALS),
  )

  const ratio = denormalize(newPoolSupply).div(poolSupply)

  const power = new Big(1).div(token.weight || 0)

  const tokenInRatio = ratio.toNumber() ** power.toNumber()

  const tokenBalanceIn = denormalize(token.poolBalance || 0, token.decimals)

  const newTokenBalanceIn = tokenBalanceIn.times(tokenInRatio)

  const tokenAmountInAfterFee = newTokenBalanceIn.minus(tokenBalanceIn)

  const feeCoeficient = new Big(1).minus(token.weight || 0).times(pool.swapFee)

  if (feeCoeficient.eq(1)) {
    return new Big(0)
  }

  const tokenAmountIn = tokenAmountInAfterFee.div(
    new Big(1).minus(feeCoeficient),
  )

  return tokenAmountIn.times(1 + slippage)
}

export const calcMultipleOutByPoolAmountIn = (
  pool: Pool,
  poolAmountIn: BigSource,
  token: ExtendedPoolToken,
  slippage = BALANCE_BUFFER,
) => {
  if (new Big(pool.totalShares).eq(0)) {
    return new Big(0)
  }

  return denormalize(token.poolBalance || 0, token.decimals)
    .times(denormalize(poolAmountIn, SPT_DECIMALS))
    .div(denormalize(pool.totalShares, SPT_DECIMALS))
    .times(1 - slippage)
}

export const calcMaxPoolInBySingleOut = (
  pool: Pool,
  tokenOut: ExtendedPoolToken,
) => {
  const poolSupply = denormalize(pool.totalShares, SPT_DECIMALS)

  const normalizedWeight = new Big(tokenOut.weight || 0)

  const maxTokenOutRatio = new Big(1).minus(MAX_OUT_RATIO)

  const poolRatio = new Big(
    maxTokenOutRatio.toNumber() ** normalizedWeight.toNumber(),
  )

  const newPoolSupply = poolRatio.times(poolSupply)

  const maxPoolAmountIn = poolSupply.minus(newPoolSupply)

  return normalize(maxPoolAmountIn, SPT_DECIMALS)
}

export const calcSingleOutByPoolAmountIn = (
  pool: Pool,
  poolAmountIn: BigSource,
  tokenOut: ExtendedPoolToken,
  slippage = BALANCE_BUFFER,
) => {
  if (
    !tokenOut.decimals ||
    new Big(poolAmountIn).eq(0) ||
    new Big(pool.totalShares).eq(0) ||
    new Big(tokenOut.weight || 0).eq(0)
  ) {
    return new Big(0)
  }
  const tokenBalanceOut = denormalize(
    tokenOut.poolBalance || 0,
    tokenOut.decimals,
  )
  const normalizedWeight = new Big(tokenOut.weight || 0)
  const poolSupply = denormalize(pool.totalShares, SPT_DECIMALS)
  const newPoolSupply = poolSupply.minus(
    denormalize(poolAmountIn, SPT_DECIMALS),
  )
  const poolRatio = newPoolSupply.div(poolSupply)
  const tokenOutRatio = new Big(
    poolRatio.toNumber() ** new Big(1).div(normalizedWeight).toNumber(),
  )
  const newTokenBalanceOut = tokenOutRatio.times(tokenBalanceOut)
  const tokenAmountOutBeforeSwapFee = tokenBalanceOut.minus(newTokenBalanceOut)
  const zaz = new Big(1).minus(normalizedWeight).times(pool.swapFee)
  const tokenAmountOut = tokenAmountOutBeforeSwapFee
    .times(new Big(1).minus(zaz))
    .times(1 - slippage)

  return tokenAmountOut
}

export const calcAmountInByPoolAmountOut = (
  pool: Pool,
  poolAmountIn: BigSource,
  tokenOut: ExtendedPoolToken,
  multiple = true,
  slippage = BALANCE_BUFFER,
) =>
  multiple
    ? calcMultipleOutByPoolAmountIn(pool, poolAmountIn, tokenOut, slippage)
    : calcSingleOutByPoolAmountIn(pool, poolAmountIn, tokenOut, slippage)

export const calcProtocolFee = async (
  tokenIn?: Pick<Token, 'decimals'>,
  amountIn: BigSource = 0,
  swapFee: BigSource = 0,
) => {
  if (!tokenIn || swapFee === 0 || amountIn === 0) return ZERO

  const [PROTOCOL_FEE, MIN_PROTOCOL_FEE] = await Promise.all([
    ProtocolFee.getProtocolFee(),
    ProtocolFee.getMinProtocolFee(),
  ])

  const denormalizedAmountIn = denormalize(amountIn, tokenIn.decimals)

  const poolSwapFee = big(swapFee).times(denormalizedAmountIn)

  return max(
    poolSwapFee.times(PROTOCOL_FEE),
    denormalizedAmountIn.times(MIN_PROTOCOL_FEE),
  )
}

export const calcOutGivenIn = (
  tokenIn?: PoolToken,
  tokenOut?: PoolToken,
  amountIn: BigSource = 0,
  swapFee: BigSource = 0,
) => {
  if (!tokenIn || !tokenOut || !tokenIn.balance || new Big(swapFee).gte(1)) {
    return new Big(0)
  }

  const denormalizedAmountIn = denormalize(amountIn, tokenIn.decimals)

  if (denormalizedAmountIn.eq(0)) {
    return new Big(0)
  }

  const weightRatio = new Big(tokenIn.denormWeight).div(
    tokenOut.denormWeight || 1,
  )
  const adjustedIn = new Big(1).minus(swapFee).times(denormalizedAmountIn)

  const y = denormalize(tokenIn.balance || 0, tokenIn.decimals).div(
    denormalize(tokenIn.balance || 0, tokenIn.decimals)
      .add(adjustedIn)
      .toNumber() || 1,
  )

  const foo = y.toNumber() ** weightRatio.toNumber()
  const bar = new Big(1).minus(foo)

  const tokenAmountOut = denormalize(
    tokenOut.balance || 0,
    tokenOut.decimals,
  ).times(bar)

  return tokenAmountOut
}

export const calcInGivenOut = (
  tokenIn?: PoolToken,
  tokenOut?: PoolToken,
  amountOut: BigSource = 0,
  swapFee: BigSource = 0,
) => {
  if (
    !tokenIn ||
    !tokenOut ||
    new Big(tokenOut.denormWeight).eq(0) ||
    new Big(swapFee).eq(1)
  ) {
    return new Big(0)
  }

  const denormalizedAmountOut = denormalize(amountOut, tokenOut.decimals)

  if (denormalizedAmountOut.eq(0)) {
    return new Big(0)
  }

  const weightRatio = new Big(tokenIn.denormWeight).div(
    tokenOut.denormWeight || 1,
  )

  const tokenBalanceIn = denormalize(tokenIn.balance || 0, tokenIn.decimals)
  const tokenBalanceOut = denormalize(tokenOut.balance || 0, tokenOut.decimals)

  if (denormalizedAmountOut.gte(tokenBalanceOut)) {
    return new Big(0)
  }

  const diff = tokenBalanceOut.minus(denormalizedAmountOut)
  const y = tokenBalanceOut.div(diff)

  const foo = y.toNumber() ** weightRatio.toNumber() - 1

  const tokenAmountIn = tokenBalanceIn.times(foo).div(new Big(1).minus(swapFee))

  return tokenAmountIn
}

export const calcSpotPrice = (
  tokenBalanceIn: BigSource,
  tokenWeightIn: BigSource,
  tokenBalanceOut: BigSource,
  tokenWeightOut: BigSource,
  swapFee: BigSource,
) => {
  if (
    new Big(tokenWeightIn).eq(0) ||
    new Big(tokenWeightOut).eq(0) ||
    new Big(tokenBalanceOut).eq(0)
  ) {
    return new Big(0)
  }

  const numer = new Big(tokenBalanceIn).div(tokenWeightIn)
  const denom = new Big(tokenBalanceOut).div(tokenWeightOut)
  const ratio = numer.div(denom)
  const scale = new Big(1).div(new Big(1).minus(swapFee))
  return ratio.times(scale)
}

export const isPoolForExtraReward = (pool?: Pool) => {
  if (!pool) return false
  return pool.id === extraRewardAddress
}

export const calcPoolTokenExchangeRate = ({
  tokens,
  totalShares,
}: Pick<Pool, 'tokens' | 'totalShares'>) => {
  if (Number(totalShares) === 0 || !tokens?.length) {
    return 0
  }

  return (
    (tokens.reduce(
      (acc, token) =>
        acc + Number(token.balance || 0) * Number(token.exchangeRate || 0),
      0,
    ) || 0) / Number(totalShares)
  )
}
