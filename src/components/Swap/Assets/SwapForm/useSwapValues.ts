import { useState, useCallback, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import useAsyncMemo from 'src/hooks/useAsyncMemo'
import { MAX_IN_RATIO } from 'src/shared/consts'
import { PoolExpanded, SwapTxSettings } from 'src/shared/types'
import { ExtendedPoolToken } from 'src/shared/types/tokens'
import { normalize, ZERO } from 'src/shared/utils/big-helpers'
import { propEquals } from 'src/shared/utils/collection/filters'
import {
  calcOutGivenIn,
  calcInGivenOut,
  calcProtocolFee,
  calcSpotPrice,
} from 'src/shared/utils/pool-calc'
import { useQueryParam } from 'use-query-params'
import { useBalanceOf } from 'src/shared/observables/balanceOf'
import { isNil } from 'lodash'

interface SwapValues {
  amountIn: number
  amountOut: number
}

const DefaultSwapValues: SwapValues = {
  amountIn: 0,
  amountOut: 0,
}

const useSwapValues = (
  tokenIn?: ExtendedPoolToken,
  tokenOut?: ExtendedPoolToken,
  pool?: Partial<PoolExpanded> | null,
  settings?: SwapTxSettings,
  initialValue: SwapValues = DefaultSwapValues,
) => {
  const { t } = useTranslation(['swap'])
  const [, setAmountOutValue] = useQueryParam<string | undefined>('amountOut')

  const tokenBalanceIn = useBalanceOf(pool?.id, tokenIn?.xToken?.id)
  const tokenBalanceOut = useBalanceOf(pool?.id, tokenOut?.xToken?.id)

  const [fromPoolToken, toPoolToken] = useMemo(() => {
    const [from, to] = [
      tokenIn?.xToken?.poolTokens?.find(propEquals('poolId.id', pool?.id)),
      tokenOut?.xToken?.poolTokens?.find(propEquals('poolId.id', pool?.id)),
    ]

    return [
      from && {
        ...from,
        balance: tokenBalanceIn || from.balance || ZERO,
      },
      to && { ...to, balance: tokenBalanceOut || to.balance || ZERO },
    ]
  }, [
    pool?.id,
    tokenBalanceIn,
    tokenBalanceOut,
    tokenIn?.xToken?.poolTokens,
    tokenOut?.xToken?.poolTokens,
  ])

  const [{ amountIn, amountOut }, setValues] = useState<SwapValues>(
    initialValue,
  )

  const [maxAmountIn] = useAsyncMemo(
    async () => {
      const maxIn = Math.min(
        tokenIn?.balance?.toNumber() || 0,
        fromPoolToken?.balance?.times(MAX_IN_RATIO).toNumber() || 0,
      )

      return (
        maxIn -
        normalize(
          await calcProtocolFee(tokenIn, maxIn, pool?.swapFee || 0),
          tokenIn?.decimals,
        ).toNumber()
      )
    },
    0,
    [tokenIn?.balance, fromPoolToken?.balance, pool?.swapFee],
  )

  const lastPrice = useMemo(
    () =>
      calcSpotPrice(
        toPoolToken?.balance || 0,
        toPoolToken?.denormWeight || 0,
        fromPoolToken?.balance || 0,
        fromPoolToken?.denormWeight || 0,
        pool?.swapFee || 0,
      ).toNumber(),
    [
      toPoolToken?.balance,
      toPoolToken?.denormWeight,
      fromPoolToken?.balance,
      fromPoolToken?.denormWeight,
      pool?.swapFee,
    ],
  )

  const validation = useMemo(() => {
    const insufficientBalance =
      !isNil(tokenIn?.balance) && Number(tokenIn?.balance || 0) < amountIn
    const insufficientPoolBalance =
      Number(toPoolToken?.balance || 0) < amountOut
    const maxInRatio =
      !isNil(tokenIn?.balance) &&
      amountIn > Number(fromPoolToken?.balance || 0) * MAX_IN_RATIO.toNumber()
    const zeroAmount = amountIn === 0 || amountOut === 0
    const { tolerance = 0 } = settings || {}
    const invalidSettings = tolerance < 0 || tolerance > 100

    return {
      valid:
        !insufficientBalance && !maxInRatio && !zeroAmount && !invalidSettings,
      error:
        (insufficientBalance &&
          t('assets.insufficientBalance', { symbol: tokenIn?.symbol })) ||
        (insufficientPoolBalance &&
          t('assets.insufficientPoolBalance', { symbol: tokenOut?.symbol })) ||
        (maxInRatio && t('assets.maxInRatio')),
    }
  }, [
    tokenIn?.balance,
    tokenIn?.symbol,
    amountIn,
    toPoolToken?.balance,
    amountOut,
    fromPoolToken?.balance,
    settings,
    t,
    tokenOut?.symbol,
  ])

  const setAmountIn = useCallback(
    (value: number) => {
      setValues({
        amountIn: value,
        amountOut: normalize(
          calcOutGivenIn(fromPoolToken, toPoolToken, value, pool?.swapFee),
          toPoolToken?.decimals,
        )
          .round(toPoolToken?.decimals, 0)
          .toNumber(),
      })
      setAmountOutValue(undefined)
    },
    [fromPoolToken, toPoolToken, pool?.swapFee, setAmountOutValue],
  )

  const setAmountOut = useCallback(
    (value: number) => {
      setValues({
        amountIn: normalize(
          calcInGivenOut(fromPoolToken, toPoolToken, value, pool?.swapFee),
          fromPoolToken?.decimals,
        )
          .round(fromPoolToken?.decimals, 0)
          .toNumber(),
        amountOut: value,
      })
      setAmountOutValue(String(value))
    },
    [fromPoolToken, toPoolToken, pool?.swapFee, setAmountOutValue],
  )

  useEffect(() => {
    setValues((prevValues) => ({
      amountIn: prevValues.amountIn,
      amountOut: normalize(
        calcOutGivenIn(
          fromPoolToken,
          toPoolToken,
          prevValues.amountIn,
          pool?.swapFee,
        ),
        toPoolToken?.decimals,
      )
        .round(toPoolToken?.decimals, 0)
        .toNumber(),
    }))
  }, [fromPoolToken, pool?.swapFee, toPoolToken])

  return {
    amountIn,
    amountOut,
    maxAmountIn,
    lastPrice,
    ...validation,
    setAmountIn,
    setAmountOut,
  }
}

export default useSwapValues
