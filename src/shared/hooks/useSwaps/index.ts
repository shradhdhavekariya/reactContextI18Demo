import { useCallback, useMemo, useState, useEffect } from 'react'
import { NetworkStatus, useQuery } from '@apollo/client'
import { Swap } from 'src/shared/types'
import { SwapsQuery } from 'src/queries'
import useEffectCompare from '../useEffectCompare'
import { SwapQueryVariables, SwapsQueryResult, UseSwapsOptions } from './types'
import { DEFAULT_OPTIONS } from './consts'
import { mapOptionsToVariables } from './helpers'

const useSwaps = (options: UseSwapsOptions): SwapsQueryResult => {
  const variables = useMemo(
    () => mapOptionsToVariables({ ...DEFAULT_OPTIONS, ...options }),
    [options],
  )

  const noTokensPassed = !options.tokenPair || options.tokenPair.length !== 2
  const [hasMore, setHasMore] = useState(!noTokensPassed)

  const {
    data,
    loading,
    error,
    networkStatus,
    refetch: nativeRefetch,
    called,
    fetchMore: nativeFetchMore,
  } = useQuery<{ swaps: Swap[] }, SwapQueryVariables>(SwapsQuery, {
    variables,
    skip: noTokensPassed || options.ignore,
    notifyOnNetworkStatusChange: true,
  })

  const refetch = useCallback(
    async (limit?: number) => {
      if (noTokensPassed || loading) {
        return Promise.resolve(null)
      }

      return nativeRefetch({
        ...variables,
        limit: limit || data?.swaps.length || variables.limit,
      })
    },
    [data?.swaps.length, loading, nativeRefetch, noTokensPassed, variables],
  )

  const fetchMore = useCallback(async () => {
    if (noTokensPassed || loading) {
      return
    }

    const {
      data: { swaps },
    } = await nativeFetchMore({
      variables: { ...variables, skip: data?.swaps?.length },
    })

    setHasMore(!!swaps.length && swaps.length === variables.limit)
  }, [data?.swaps?.length, loading, nativeFetchMore, noTokensPassed, variables])

  useEffectCompare(() => {
    refetch(options.limit)
  }, [
    noTokensPassed,
    options.tokenPair?.[0],
    options.tokenPair?.[1],
    options.limit,
  ])

  useEffect(() => {
    setHasMore(!noTokensPassed)
  }, [noTokensPassed])

  return {
    data,
    called,
    loading:
      loading ||
      ![NetworkStatus.ready, NetworkStatus.error].includes(networkStatus),
    error,
    refetching: networkStatus === NetworkStatus.refetch,
    refetch,
    fetchMore,
    hasMore,
  }
}

export * from './types'
export * from './consts'
export default useSwaps
