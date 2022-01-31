import { useMemo } from 'react'
import { combineLatest, of } from 'rxjs'
import { map } from 'rxjs/operators'
import useArrayInjector from 'src/shared/hooks/useArrayInjector'
import { NativeToken, ProxyToken } from 'src/shared/types/tokens'
import exchangeRateOf$ from 'src/shared/observables/exchangeRateOf'
import { useAssetTokens } from 'src/shared/hooks'
import balanceOf$ from 'src/shared/observables/balanceOf'
import { ZERO } from 'src/shared/utils/big-helpers'

const useProxyAddressTokens = (cpkAddress?: string) => {
  const {
    allTokens: allNativeTokens,
    loading: queryLoading,
    error,
  } = useAssetTokens()

  const fullTokens = useArrayInjector<ProxyToken>(
    useMemo(
      () => ({
        cpkXTokenBalance: (token: NativeToken) =>
          cpkAddress && token.xToken
            ? balanceOf$(cpkAddress)(token.xToken)
            : of(ZERO),
        cpkXTokenUsdBalance: (token: NativeToken) =>
          combineLatest([
            cpkAddress && token.xToken
              ? balanceOf$(cpkAddress)(token.xToken)
              : of(ZERO),
            exchangeRateOf$(0)(token),
          ]).pipe(
            map(
              ([balance, exchangeRate]) =>
                balance?.times(exchangeRate || 0).toNumber() || 0,
            ),
          ),
      }),
      [cpkAddress],
    ),
    useMemo(
      () =>
        [...allNativeTokens].map((token) => ({
          ...token,
          cpkXTokenBalance: undefined,
          cpkXTokenUsdBalance: 0,
        })),
      [allNativeTokens],
    ),
  )

  const positiveTokens = useMemo(
    () =>
      fullTokens?.filter(
        ({ cpkXTokenBalance }) => cpkXTokenBalance && cpkXTokenBalance.gt(0),
      ),
    [fullTokens],
  )

  return {
    tokens: positiveTokens,
    loading:
      queryLoading ||
      fullTokens.some(
        (token) =>
          token.cpkXTokenBalance === null ||
          (typeof token.cpkXTokenBalance === 'undefined' && cpkAddress),
      ),
    error,
  }
}

export default useProxyAddressTokens
