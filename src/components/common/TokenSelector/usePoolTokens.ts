import { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { ExtendedPoolToken, PoolToken } from 'src/shared/types/tokens'
import {
  poolTokenToToken,
  prettifyTokenList,
  tokenFilter,
} from 'src/shared/utils'
import useArrayInjector from 'src/shared/hooks/useArrayInjector'
import { useIsLoggedIn } from 'src/state/hooks'
import contractOf$ from 'src/shared/observables/contractOf'
import { POLL_INTERVAL } from 'src/shared/consts/time'
import { useAccount } from 'src/shared/web3'
import balanceOf$ from 'src/shared/observables/balanceOf'
import { PoolTokensQuery } from 'src/queries'

const usePoolTokens = (search = '', filter?: (token: PoolToken) => boolean) => {
  const isLoggedIn = useIsLoggedIn()
  const account = useAccount()

  const { data, loading, error, refetch } = useQuery(PoolTokensQuery, {
    pollInterval: POLL_INTERVAL,
  })

  const cleanTokens = useMemo<PoolToken[]>(
    () => prettifyTokenList(data?.poolTokens.map(poolTokenToToken)),
    [data?.poolTokens],
  )

  const allTokens = useArrayInjector<ExtendedPoolToken>(
    useMemo(
      () =>
        isLoggedIn
          ? {
              contract: (token) => contractOf$()(token),
              balance: balanceOf$(account),
            }
          : undefined,
      [account, isLoggedIn],
    ),
    useMemo(() => cleanTokens, [cleanTokens]),
  )

  const tokens = useMemo(() => allTokens.filter(tokenFilter(search, filter)), [
    allTokens,
    filter,
    search,
  ])

  return { allTokens, tokens, loading, error, refetch }
}

export default usePoolTokens
