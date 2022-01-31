import { useCpk } from 'src/cpk'
import { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { combineLatest } from 'rxjs'
import exchangeRateOf$ from 'src/shared/observables/exchangeRateOf'
import { Pool } from 'src/shared/types'
import { map } from 'rxjs/operators'
import { AllPoolsQuery, XTokensQuery } from 'src/queries'
import { createPoolsFilter, tokenFilter } from '../utils'
import { PoolToken, XToken } from '../types/tokens'
import useAbstractTokens from './useAbstractTokens'
import useArrayInjector from './useArrayInjector'
import { propEquals } from '../utils/collection/filters'
import contractOf$ from '../observables/contractOf'
import { POLL_INTERVAL } from '../consts/time'
import { SPT_DECIMALS } from '../consts'
import balanceOf$ from '../observables/balanceOf'
import { calcPoolTokenExchangeRate } from '../utils/pool-calc'

interface PoolsDto {
  pools: Pick<Pool, 'id' | 'totalWeight' | 'tokens'>[]
}

export interface OwnablePoolToken extends XToken {
  tokens: PoolToken[]
  exchangeRate?: number
  userBalances: {
    ether: number
    usd: number
    loading: boolean
  }
}

type FullPoolToken = Pick<Pool, 'id' | 'totalWeight' | 'totalShares'> & {
  decimals: number
  tokens: PoolToken[]
}

interface UsePoolTokensParams {
  search?: string
  filter?: (token: XToken) => boolean
  cpkAddress?: string
}

const usePoolTokens = ({
  cpkAddress,
  search = '',
  filter,
}: UsePoolTokensParams) => {
  const cpk = useCpk()

  const selectedCpkAddress = cpkAddress || cpk?.address

  const { data, loading: pLoading, error: pError } = useQuery<PoolsDto>(
    AllPoolsQuery,
    {
      variables: {
        filter: createPoolsFilter(),
      },
      fetchPolicy: 'no-cache',
      pollInterval: POLL_INTERVAL,
    },
  )

  const poolAddresses = useMemo<string[]>(
    () => (!pLoading && data?.pools ? data?.pools.map((pool) => pool.id) : []),
    [data?.pools, pLoading],
  )

  const {
    allTokens: rawTokens,
    tokenAddrs,
    loading: tokensLoading,
    error: tokensError,
    refetch,
  } = useAbstractTokens<XToken>(XTokensQuery, {
    skip: pLoading,
    variables: {
      filter: poolAddresses.length
        ? {
            token_in: poolAddresses,
          }
        : {},
    },
  })

  const poolTokens = useArrayInjector<FullPoolToken>(
    useMemo(
      () => ({
        tokens: (pool) =>
          combineLatest(
            pool.tokens
              .map((token) => ({
                ...token,
                address: token.xToken?.token.id || token.address,
                id: token.xToken?.token.id || token.address,
              }))
              .map((token) =>
                exchangeRateOf$(0)(token).pipe(
                  map((exchangeRate) => ({
                    ...token,
                    exchangeRate: exchangeRate || 0,
                  })),
                ),
              ),
          ),
      }),
      [],
    ),
    useMemo(
      () =>
        (data?.pools || []).map((pool) => ({
          ...pool,
          decimals: SPT_DECIMALS,
        })) as FullPoolToken[],
      [data?.pools],
    ),
  )

  const allTokens = useArrayInjector<OwnablePoolToken>(
    useMemo(
      () => ({
        userBalances: (rawToken) =>
          balanceOf$(selectedCpkAddress)(rawToken).pipe(
            map((ether) => ({
              ether: ether?.toNumber() || 0,
              usd: ether?.times(rawToken?.exchangeRate || 0).toNumber() || 0,
              loading:
                ether === null ||
                (typeof ether === 'undefined' && !!selectedCpkAddress),
            })),
          ),
        contract: contractOf$(),
      }),
      [selectedCpkAddress],
    ),
    useMemo(
      () =>
        rawTokens.map((rawToken) => {
          const poolToken = poolTokens.find(propEquals('id', rawToken.token.id))

          return {
            ...rawToken,
            tokens: poolToken?.tokens || [],
            exchangeRate: poolToken ? calcPoolTokenExchangeRate(poolToken) : 0,
            userBalances: {
              ether: 0,
              usd: 0,
              loading: !!selectedCpkAddress,
            },
          }
        }) as OwnablePoolToken[],
      [poolTokens, rawTokens, selectedCpkAddress],
    ),
  )

  const areBalancesLoading = allTokens.some(
    (token) => token.userBalances.loading,
  )

  const tokens = useMemo(() => allTokens.filter(tokenFilter(search, filter)), [
    allTokens,
    filter,
    search,
  ])

  const queryOpts = {
    loading: pLoading || tokensLoading || areBalancesLoading,
    errors: [pError, tokensError].filter((error) => error),
    refetch,
  }

  return { allTokens, tokens, tokenAddrs, ...queryOpts }
}

export default usePoolTokens
