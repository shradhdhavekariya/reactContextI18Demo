import { useMemo } from 'react'
import { Big } from 'big.js'
import { of } from 'rxjs'
import { useCpk } from 'src/cpk'
import { useAccount } from 'src/shared/web3'
import { switchMap } from 'rxjs/operators'
import balanceOf$ from 'src/shared/observables/balanceOf'
import allowanceOf$ from '../observables/allowanceOf'
import exchangeRateOf$ from '../observables/exchangeRateOf'
import usdBalanceOf$ from '../observables/usdBalanceOf'
import useArrayInjector, { InjectionCreatorMap } from './useArrayInjector'
import { Pool } from '../types'
import { poolTokenToToken } from '../utils'
import contractOf$ from '../observables/contractOf'
import { ExtendedPoolToken } from '../types/tokens'

const useFullTokens = (pool?: Pool) => {
  const account = useAccount()
  const cpk = useCpk()

  const map = useMemo<InjectionCreatorMap<ExtendedPoolToken>>(
    () => ({
      contract: contractOf$(),
      exchangeRate: exchangeRateOf$(0),
      balance: balanceOf$(account),
      usdBalance: usdBalanceOf$(account),
      cpkBalance: balanceOf$(cpk?.address),
      cpkAllowance: allowanceOf$(account, cpk?.address),
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
    [account, cpk?.address],
  )

  return useArrayInjector(
    map,
    useMemo(
      () =>
        pool?.tokens?.length
          ? pool.tokens.map(poolTokenToToken).map((token) => ({
              ...token,
              weight: new Big(pool.totalWeight).eq(0)
                ? 0
                : new Big(token.denormWeight || 0)
                    .div(pool.totalWeight)
                    .toNumber(),
            }))
          : [],
      [pool?.tokens, pool?.totalWeight],
    ),
  )
}

export default useFullTokens
