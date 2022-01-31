import { useRef, useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { subDays, getUnixTime, startOfDay } from 'date-fns'
import { useCpk } from 'src/cpk'
import { useAccount } from 'src/shared/web3'
import { XTokenWrapper } from 'src/contracts/XTokenWrapper'
import { NativeTokensQuery, SinglePoolQuery } from 'src/queries'
import { NativeToken } from '../types/tokens'
import useAbstractTokens from './useAbstractTokens'
import { PoolExpanded } from '../types'
import useAsyncMemo from '../../hooks/useAsyncMemo'
import useInjector from './useInjector'
import useFullTokens from './useFullTokens'
import balanceOf$ from '../observables/balanceOf'
import { POLL_INTERVAL } from '../consts/time'

interface PoolDto {
  pool: PoolExpanded
}

interface PoolQueryVariables {
  id?: string
  currentTimestamp: number
}

const usePoolDetails = (id?: string) => {
  const account = useAccount()
  const cpk = useCpk()

  const { current: currentTimestamp } = useRef(
    getUnixTime(subDays(startOfDay(Date.now()), 1)),
  )
  const {
    data: poolData,
    loading: poolLoading,
    error: poolError,
    refetch,
  } = useQuery<PoolDto, PoolQueryVariables>(SinglePoolQuery, {
    variables: { ...(id && { id }), currentTimestamp },
    skip: !id,
    pollInterval: POLL_INTERVAL,
  })

  const [xPoolTokenAddress] = useAsyncMemo(
    async () =>
      poolData?.pool && XTokenWrapper.tokenToXToken(poolData?.pool.id),
    undefined,
    [poolData?.pool?.id],
  )

  const pool = useInjector(
    useMemo(
      () =>
        xPoolTokenAddress
          ? {
              balance: balanceOf$(account)({
                id: xPoolTokenAddress,
              }),
              cpkBalance: balanceOf$(cpk?.address)({
                id: xPoolTokenAddress,
              }),
            }
          : undefined,
      [account, cpk?.address, xPoolTokenAddress],
    ),
    poolData?.pool,
  )

  const fullTokens = useFullTokens(pool)

  const {
    allTokens: poolTokens,
    loading: poolTokenLoading,
    error: poolTokenError,
  } = useAbstractTokens<NativeToken>(NativeTokensQuery, {
    variables: {
      filter: { id },
    },
    skip: !id,
    pollInterval: POLL_INTERVAL,
  })

  const reload = async () => {
    if (id) {
      await refetch({ id, currentTimestamp })
    }
  }

  return {
    pool: pool && {
      ...pool,
      xPoolTokenAddress,
      tokens: fullTokens,
    },
    poolToken: poolTokens[0],
    loading:
      poolLoading || poolTokenLoading || (!!id && typeof pool === 'undefined'),
    errors: [poolError, poolTokenError].filter((err) => !!err),
    refetch: reload,
  }
}

export default usePoolDetails
