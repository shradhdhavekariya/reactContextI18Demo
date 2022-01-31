import { useMemo, useRef } from 'react'
import { gql, useQuery } from '@apollo/client'
import { jsonToGraphQLQuery } from 'json-to-graphql-query'
import Big from 'big.js'
import { addDays, getUnixTime, startOfToday, subDays } from 'date-fns'
import { Obj } from '../types'

interface ReceivedMetrics {
  poolTotalSwapVolume: string
  poolTotalSwapFee: string
  poolLiquidity: string
}

export const usePoolMetrics = (poolAddress: string) => {
  const { current: today } = useRef(startOfToday())
  const queryObj = useMemo(
    () =>
      [...Array.from({ length: 31 })].reduce((map: Obj, _, i) => {
        const day = subDays(today, i)
        const timestamp = getUnixTime(day)
        return {
          ...map,
          [`stamp_${timestamp}`]: {
            __aliasFor: 'swaps',
            __args: {
              first: 1,
              orderBy: 'timestamp',
              orderDirection: 'desc',
              where: {
                poolAddress,
                timestamp_gt: timestamp,
                timestamp_lt: getUnixTime(addDays(day, 1)),
              },
            },
            poolTotalSwapVolume: true,
            poolTotalSwapFee: true,
            poolLiquidity: true,
          },
        }
      }, {}),
    [poolAddress, today],
  )

  const rawQueryString = jsonToGraphQLQuery({ query: queryObj })

  const { data, loading, error } = useQuery<Record<string, ReceivedMetrics[]>>(
    gql(rawQueryString),
    {
      skip: !rawQueryString,
      fetchPolicy: 'no-cache',
    },
  )

  const keys = useMemo(() => Object.keys(data || {}), [data])
  const newKeys = useMemo(() => keys.map((key) => +key.replace('stamp_', '')), [
    keys,
  ])

  const metrics = useMemo(
    () =>
      keys?.reduce(
        (map: Record<number, ReceivedMetrics>, key, index) => ({
          ...map,
          [newKeys[index]]: data?.[key].length
            ? data?.[key][0]
            : map[newKeys[index - 1]] || {},
        }),
        {},
      ),
    [data, keys, newKeys],
  )

  const liquidityMetrics = useMemo<Record<number, number>>(
    () =>
      newKeys.reduce(
        (map, key) => ({
          ...map,
          [key]: new Big(metrics?.[key].poolLiquidity || 0).toNumber(),
        }),
        {},
      ),
    [metrics, newKeys],
  )

  const volumeMetrics = useMemo(
    () =>
      newKeys.reduce((map: Record<number, number>, key, index) => {
        if (index === 0) {
          return map
        }

        const current = new Big(
          metrics?.[key].poolTotalSwapVolume || 0,
        ).toNumber()

        const previous = new Big(
          metrics?.[newKeys[index - 1]]?.poolTotalSwapVolume || 0,
        ).toNumber()

        return {
          ...map,
          [key]: current - previous,
        }
      }, {}),
    [metrics, newKeys],
  )

  const swapFeeMetrics = useMemo(
    () =>
      newKeys.reduce((map: Record<number, number>, key, index) => {
        if (index === 0) {
          return map
        }

        const totalFee = new Big(
          metrics?.[key].poolTotalSwapFee || 0,
        ).toNumber()

        const previousTotalFee = new Big(
          metrics?.[newKeys[index - 1]]?.poolTotalSwapFee || 0,
        ).toNumber()
        const dailyFee = totalFee - previousTotalFee
        const liquidity = liquidityMetrics[key]

        return {
          ...map,
          [key]: (dailyFee / liquidity) * 365 * 100 || 0,
        }
      }, {}),
    [metrics, newKeys, liquidityMetrics],
  )

  return {
    timestamps: newKeys.slice(1),
    liquidityMetrics,
    volumeMetrics,
    swapFeeMetrics,
    loading,
    error,
  }
}

export default usePoolMetrics
