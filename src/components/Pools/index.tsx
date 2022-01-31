/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NetworkStatus, useQuery } from '@apollo/client'
import { useParams } from 'react-router'
import { Box, Card, Heading, Text } from 'rimble-ui'
import styled from 'styled-components'
import { useQueryParam } from 'use-query-params'
import { map, uniqBy } from 'lodash'
import { getUnixTime, startOfDay, subDays } from 'date-fns/esm'
import InfiniteTable from 'src/components/common/InfiniteTable'
import usePoolTokens from 'src/components/common/TokenSelector/usePoolTokens'
import useDeepMemo from 'src/hooks/useDeepMemo'
import useFullPools from 'src/shared/hooks/useFullPools'
import { PoolExpanded } from 'src/shared/types'
import { POLL_INTERVAL } from 'src/shared/consts/time'
import { createPoolsFilter } from 'src/shared/utils'
import { calculateMarketCap } from 'src/shared/utils/pool'
import { useCpk } from 'src/cpk'
import { PoolsQuery } from 'src/queries'
import PoolRow from './PoolRow'
import AssetFilter from './AssetFilter'
import { getAssetFilter, getCategoryFilter } from './helpers'
import { AssetParam, PageLimit } from './consts'
import AlertPanel from '../common/AlertPanel'

const StyledInfiniteTable = styled(InfiniteTable)`
  col {
    width: 10%;
  }

  colgroup.assets {
    col {
      &:first-child {
        width: 68px;
      }
      &:nth-child(2) {
        width: 30%;
      }
    }
  }

  th,
  td {
    &:nth-last-child(-n + 4) {
      text-align: right;
    }
    min-width: 90px;
    white-space: nowrap;
  }

  td {
    color: ${(props) => props.theme.colors['near-black']};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints?.[2]}) {
    col {
      width: 0;
    }

    colgroup.assets {
      col {
        &:first-child {
          width: 68px;
        }
        &:nth-child(2) {
          width: auto;
        }
      }
    }

    col.market-cap {
      width: 100px;
    }
  }
`

const Pools = () => {
  const { t } = useTranslation('pools')

  const { current: currentTimestamp } = useRef(
    getUnixTime(subDays(startOfDay(Date.now()), 1)),
  )
  const { category = 'shared' } = useParams<{
    category?: string
  }>()

  const cpk = useCpk()

  const { tokens: poolTokens, loading: poolTokensLoading } = usePoolTokens()

  const [assetsParam, setAssetsParam] = useQueryParam('assets', AssetParam)

  const assetFilter = useMemo(() => getAssetFilter(poolTokens, assetsParam), [
    poolTokens,
    assetsParam,
  ])

  const filter = useDeepMemo(
    () => ({
      ...createPoolsFilter(),
      ...getCategoryFilter(category, cpk?.address),
      ...(assetFilter.length && {
        tokensList_contains: map(assetFilter, 'xToken.address'),
      }),
    }),
    [assetFilter, category, cpk?.address],
  )

  const [hasMore, setHasMore] = useState(true)

  const { data, called, refetch, fetchMore, networkStatus } = useQuery<{
    pools: PoolExpanded[]
  }>(PoolsQuery, {
    variables: {
      filter,
      limit: PageLimit,
      skip: 0,
      currentTimestamp,
    },
    skip: poolTokensLoading,
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    pollInterval: POLL_INTERVAL,
  })

  const loading =
    cpk === null ||
    (!poolTokens.length && poolTokensLoading) ||
    !data ||
    ![NetworkStatus.ready, NetworkStatus.error, NetworkStatus.poll].includes(
      networkStatus,
    )

  const refetching = networkStatus === NetworkStatus.refetch

  const canRefetch = called && !poolTokensLoading && cpk === null

  useEffect(() => {
    let isNotCancelled = true

    if (canRefetch) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      refetch({
        filter,
        limit: PageLimit,
        skip: 0,
      }).then(({ data: { pools } }) => {
        if (isNotCancelled) {
          setHasMore(pools?.length === PageLimit)
        }
      })
    }

    return () => {
      isNotCancelled = false
    }
  }, [canRefetch, filter, refetch])

  const loadMore = () => {
    if (data && hasMore && !loading && !poolTokensLoading) {
      fetchMore({
        variables: {
          filter,
          skip: data?.pools.length,
          limit: PageLimit,
        },
      }).then(({ data: { pools } }: any) => {
        setHasMore(pools?.length === PageLimit)
      })
    }
  }

  const pools = useFullPools(data?.pools)

  const filtered = uniqBy(pools || [], 'id')

  const sortedPools: PoolExpanded[] = useMemo(
    () =>
      filtered
        .map((pool) => {
          return { ...pool, marketCap: calculateMarketCap(pool) }
        })
        .sort((a, b) => b.marketCap - a.marketCap),
    [filtered],
  )

  return (
    <>
      <Box
        width="100%"
        bg="background"
        display="flex"
        flexDirection="column"
        p={[3, 3, 4]}
        flexGrow={1}
      >
        <AlertPanel />
        <Card
          width="100%"
          p={4}
          borderRadius={1}
          overflow="hidden"
          display="flex"
          flexDirection="column"
          justifyContent="stretch"
        >
          <Heading
            as="h3"
            mt={0}
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            flexWrap="wrap"
          >
            <Text.span
              color="grey"
              fontSize={3}
              lineHeight="28px"
              fontWeight={5}
              flexGrow={1}
              flexShrink={0}
              mb={3}
            >
              {t(`headings.${category}`)}
            </Text.span>
            <AssetFilter
              value={assetFilter}
              onSubmit={(value) => setAssetsParam(map(value, 'address'))}
              flexGrow={0}
              flexShrink={1}
              flexBasis="auto"
              tokens={poolTokens}
              loading={poolTokensLoading}
            />
          </Heading>
          <StyledInfiniteTable
            colgroup={
              <>
                <colgroup>
                  <col />
                </colgroup>
                <colgroup className="assets" span={2}>
                  <col />
                  <col />
                </colgroup>
                <colgroup>
                  <col />
                  <col className="market-cap" />
                  <col />
                  <col />
                </colgroup>
              </>
            }
            head={
              <tr>
                <th>{t(`th.poolAddress`)}</th>
                <th colSpan={2} scope="colgroup">
                  {t(`th.assets`)}
                </th>
                <th style={{ textAlign: 'center' }}>{t(`th.extraRewards`)}</th>
                <th>{t(`th.swapFee`)}</th>
                <th>{t(`th.marketCap`)}</th>
                <th>{t(`th.myShare`)}</th>
                <th>{t(`th.volume`)}</th>
              </tr>
            }
            loading={loading}
            hasMore={hasMore}
            loadMore={loadMore}
            noResults={
              <tr>
                <td colSpan={7}>
                  <Text.p color="grey" textAlign="center" width="100%">
                    {t('noPools')}
                  </Text.p>
                </td>
              </tr>
            }
          >
            {refetching
              ? []
              : sortedPools.map((pool) => (
                  <PoolRow key={pool.id} pool={pool} />
                ))}
          </StyledInfiniteTable>
        </Card>
      </Box>
    </>
  )
}

export default Pools
