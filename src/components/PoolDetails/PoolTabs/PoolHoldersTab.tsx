import { useLayoutEffect, useMemo, useState } from 'react'
import { Link, Icon } from 'rimble-ui'
import { usePoolShares } from 'src/shared/hooks'
import { PoolToken } from 'src/shared/types/tokens'
import styled from 'styled-components'
import Big from 'big.js'
import useDeepTranslation from 'src/hooks/useDeepTranslation'
import InfiniteTable from 'src/components/common/InfiniteTable'
import config from 'src/environment'
import PoolHoldersRow from './PoolHoldersRow'

const { proxy: proxyFaqLink } = config.resources.docs.gettingStarted

const StyledInfiniteTable = styled(InfiniteTable)`
  th,
  td {
    &:nth-last-child(-n + 3) {
      text-align: right;
    }
  }

  td {
    color: ${(props) => props.theme.colors.black};
  }

  .small-cols col {
    width: 20%;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints?.[1]}) {
    col.value,
    col.proxy {
      width: 0px;
    }
  }
`

export interface PoolHoldersTabProps {
  poolAddress: string
  liquidity: number
  totalShares: number
  poolToken: Partial<PoolToken>
}

const PoolHoldersTab = ({
  poolAddress,
  liquidity,
  totalShares,
  poolToken,
}: PoolHoldersTabProps) => {
  const { t } = useDeepTranslation('poolDetails', ['poolTabs', 'holders', 'th'])
  const [hasMore, setHasMore] = useState(true)
  const { data, loading, refetching, fetchMore, refetch } = usePoolShares(
    poolAddress,
  )

  useLayoutEffect(() => {
    refetch(poolAddress)
  }, [poolAddress, refetch])

  const loadMore = async () => {
    if (data && hasMore && !loading) {
      const {
        data: { poolShares },
      } = await fetchMore(data?.poolShares.length)
      setHasMore(poolShares.length === 10)
    }
  }

  const sharesInfo = useMemo(
    () =>
      data?.poolShares.map((share) => ({
        ...share,
        sptValue: totalShares
          ? new Big(liquidity).div(totalShares).toNumber()
          : 0,
        totalShares,
        poolToken,
      })),
    [data?.poolShares, liquidity, totalShares, poolToken],
  )

  return (
    <StyledInfiniteTable
      colgroup={
        <>
          <colgroup>
            <col />
            <col className="proxy" />
          </colgroup>
          <colgroup className="small-cols">
            <col />
            <col className="value" />
            <col />
          </colgroup>
        </>
      }
      head={
        <tr>
          <th>{t(`userAddress`)}</th>
          <th>
            {t(`holder`)}{' '}
            <Link
              href={proxyFaqLink}
              target="_blank"
              fontWeight={2}
              fontSize={2}
              hoverColor="light-gray"
              color="grey"
            >
              <Icon name="Help" size="16px" ml={1} />
            </Link>
          </th>
          <th>{t(`balance`)}</th>
          <th>{t(`value`)}</th>
          <th>{t(`shares`)}</th>
        </tr>
      }
      loading={loading}
      hasMore={hasMore}
      loadMore={loadMore}
      noResults={null}
      totalCols={5}
    >
      {refetching
        ? []
        : (sharesInfo || []).map((shareInfo) => (
            <PoolHoldersRow key={shareInfo.id} shareInfo={shareInfo} />
          ))}
    </StyledInfiniteTable>
  )
}

export default PoolHoldersTab
