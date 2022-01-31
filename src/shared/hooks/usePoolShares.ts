import { useCallback } from 'react'
import { NetworkStatus, useQuery } from '@apollo/client'
import { PoolSharesQuery } from 'src/queries'
import { Share } from '../types'
import { POLL_INTERVAL } from '../consts/time'

interface ShareQueryVariables {
  limit: number
  skip: number
  filter: {
    poolId: string
    balance_gt: 0
  }
}

const usePoolShares = (poolId: string) => {
  const {
    data,
    loading,
    error,
    fetchMore: nativeFetchMore,
    networkStatus,
    refetch: nativeRefetch,
  } = useQuery<{ poolShares: Share[] }, ShareQueryVariables>(PoolSharesQuery, {
    variables: {
      filter: { balance_gt: 0, poolId },
      limit: 10,
      skip: 0,
    },
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    pollInterval: POLL_INTERVAL,
  })

  const fetchMore = useCallback(
    (skip: number) =>
      nativeFetchMore({
        variables: {
          filter: { poolId, balance_gt: 0 },
          limit: 10,
          skip,
        },
      }),
    [nativeFetchMore, poolId],
  )

  const refetch = useCallback(
    (newPoolId) =>
      nativeRefetch({
        filter: { balance_gt: 0, poolId: newPoolId },
        limit: 10,
        skip: 0,
      }),
    [nativeRefetch],
  )

  return {
    data,
    loading:
      loading ||
      ![NetworkStatus.ready, NetworkStatus.error].includes(networkStatus),
    error,
    refetching: networkStatus === NetworkStatus.refetch,
    refetch,
    fetchMore,
  }
}

export default usePoolShares
