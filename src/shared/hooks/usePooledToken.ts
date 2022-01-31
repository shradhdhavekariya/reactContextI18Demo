import { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { combineLatest, of } from 'rxjs'
import { map } from 'rxjs/operators'
import { createPoolsFilter } from 'src/shared/utils'
import { AllPoolsQuery, XTokensQuery } from 'src/queries'
import { propEquals } from '../utils/collection/filters'
import { Pool } from '../types'
import useAbstractTokens from './useAbstractTokens'
import { XToken } from '../types/tokens'
import useArrayInjector from './useArrayInjector'
import UserAccount from '../types/state/user-account'
import { POLL_INTERVAL } from '../consts/time'
import balanceOf$ from '../observables/balanceOf'

interface PoolsDto {
  pools: Pick<Pool, 'id' | 'totalWeight' | 'tokens' | 'totalShares'>[]
}

const usePooledToken = <T extends XToken>(
  xTokensAddress: string,
  userAccount?: UserAccount | null,
) => {
  const {
    data: poolsData,
    loading: pLoading,
    error: pError,
  } = useQuery<PoolsDto>(AllPoolsQuery, {
    variables: {
      filter: createPoolsFilter({ tokenListContains: [xTokensAddress] }),
    },
    fetchPolicy: 'no-cache',
    pollInterval: POLL_INTERVAL,
    skip: !xTokensAddress,
  })

  const poolAddresses = useMemo(
    () =>
      !pLoading && poolsData?.pools
        ? poolsData?.pools.map((pool) => pool.id)
        : [],
    [poolsData?.pools, pLoading],
  )

  const {
    allTokens,
    loading: tokensLoading,
    error: tokensError,
    refetch,
    fetched: tokensFetched,
  } = useAbstractTokens<T>(XTokensQuery, {
    variables: {
      filter: poolAddresses.length
        ? {
            token_in: poolAddresses,
          }
        : {},
    },
  })

  const fullTokens = useArrayInjector(
    useMemo(
      () => ({
        balance: (
          rawToken: XToken & { poolTotalShares: number; poolBalance: number },
        ) =>
          userAccount
            ? combineLatest([
                balanceOf$(userAccount?.address)(rawToken),
                balanceOf$(userAccount?.cpkAddress)(rawToken),
              ]).pipe(
                map(([balance, cpkBalance]) => {
                  if (!balance || !cpkBalance) {
                    return undefined
                  }

                  return (
                    (rawToken.poolBalance *
                      balance.add(cpkBalance).toNumber()) /
                    (rawToken.poolTotalShares || 1)
                  )
                }),
              )
            : of(undefined),
      }),
      [userAccount],
    ),
    useMemo(
      () =>
        allTokens.map((xToken) => {
          const pool = poolsData?.pools?.find(propEquals('id', xToken.token.id))
          const poolToken = pool?.tokens.find(
            propEquals('address', xTokensAddress),
          )

          return {
            ...xToken,
            weight:
              Number(poolToken?.denormWeight) /
              (Number(pool?.totalWeight) || 0),
            poolTotalShares: Number(pool?.totalShares) || 0,
            poolBalance: Number(poolToken?.balance || 0),
          }
        }),
      [allTokens, poolsData?.pools, xTokensAddress],
    ),
  )

  return {
    pooledTokens: fullTokens,
    loading:
      pLoading ||
      tokensLoading ||
      (allTokens.length &&
        fullTokens.some((token) => typeof token.balance === 'undefined')),
    errors: [pError, tokensError].filter((error) => error),
    refetch,
    fetched: !!poolsData && tokensFetched,
  }
}

export default usePooledToken
