import { of } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { useMemo } from 'react'
import { ExtendedPoolToken } from 'src/shared/types/tokens'
import { useNativeTokens } from 'src/hooks/subgraph'
import useArrayInjector from 'src/shared/hooks/useArrayInjector'
import contractOf$ from 'src/shared/observables/contractOf'
import exchangeRateOf$ from 'src/shared/observables/exchangeRateOf'
import allowanceOf$ from 'src/shared/observables/allowanceOf'
import balanceOf$ from 'src/shared/observables/balanceOf'
import { POLL_INTERVAL } from 'src/shared/consts/time'
import { useAccount, useReadyState } from 'src/shared/web3'
import { useCpk } from 'src/cpk'
import userBalances$ from 'src/shared/observables/userBalances'
import { balancesLoading } from 'src/shared/utils/tokens/balance'

const useSwapTokens = () => {
  const account = useAccount()
  const cpk = useCpk()
  const ready = useReadyState()

  const {
    nativeTokens,
    loading: tokensLoading,
    refetch: reloadTokens,
  } = useNativeTokens<ExtendedPoolToken>({
    skip: !ready,
    variables: { filter: { symbol_not: 'SPT' } },
    pollInterval: POLL_INTERVAL,
  })

  const fullTokens = useArrayInjector<ExtendedPoolToken>(
    useMemo(
      () => ({
        ...(account && {
          contract: contractOf$(),
          exchangeRate: exchangeRateOf$(0),
          balance: balanceOf$(account),
          cpkBalance: balanceOf$(cpk?.address),
          cpkAllowance: allowanceOf$(account, cpk?.address),
          userBalances: userBalances$(account),
          xToken: (token) =>
            token?.xToken
              ? balanceOf$(cpk?.address)(token?.xToken).pipe(
                  switchMap((xTokenCpkBalance) =>
                    of({
                      ...token?.xToken,
                      cpkBalance: xTokenCpkBalance,
                    }),
                  ),
                )
              : of(token?.xToken),
        }),
      }),
      [account, cpk?.address],
    ),
    nativeTokens,
  )

  return {
    fullTokens,
    reloadTokens,
    loading: !ready || tokensLoading,
    balancesLoading: balancesLoading(fullTokens, account),
  }
}

export default useSwapTokens
