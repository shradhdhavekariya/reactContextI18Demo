import { useState } from 'react'
import { usePoolSwaps } from 'src/shared/hooks'
import styled from 'styled-components'
import useDeepTranslation from 'src/hooks/useDeepTranslation'
import InfiniteTable from 'src/components/common/InfiniteTable'
import PoolSwapRow from './PoolSwapRow'

const StyledInfiniteTable = styled(InfiniteTable)`
  th,
  td {
    &:nth-last-child(-n + 4) {
      text-align: right;
    }
  }

  .trade-in,
  .trade-out,
  .transaction {
    width: 180px;
  }
  .swap-fee {
    width: 95px;
  }

  td {
    color: ${(props) => props.theme.colors.black};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints?.[2]}) {
    .time,
    .transaction,
    .swap-fee {
      width: 0px;
    }

    colgroup.trade-tokens {
      col {
        width: 100%;
      }
    }
    th:nth-child(2) {
      text-align: left;
    }
  }
`

export interface PoolSwapsTabProps {
  poolAddress: string
}

const PoolSwapsTab = ({ poolAddress }: PoolSwapsTabProps) => {
  const { t } = useDeepTranslation('poolDetails', ['poolTabs', 'swaps', 'th'])
  const [hasMore, setHasMore] = useState(true)
  const { data, loading, refetching, fetchMore } = usePoolSwaps(poolAddress)

  const loadMore = async () => {
    if (data && hasMore && !loading) {
      const {
        data: { swaps },
      } = await fetchMore(data?.swaps.length)
      setHasMore(swaps.length === 10)
    }
  }

  return (
    <StyledInfiniteTable
      colgroup={
        <>
          <colgroup>
            <col className="time" />
          </colgroup>
          <colgroup className="trade-tokens">
            <col className="trade-in" />
            <col className="trade-out" />
          </colgroup>
          <colgroup>
            <col className="transaction" />
            <col className="swap-fee" />
          </colgroup>
        </>
      }
      head={
        <tr>
          <th>{t(`time`)}</th>
          <th>{t(`tradeIn`)}</th>
          <th>{t(`tradeOut`)}</th>
          <th>{t(`transaction`)}</th>
          <th>{t(`swapFee`)}</th>
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
        : (data?.swaps || []).map((swap) => (
            <PoolSwapRow key={swap.id} {...swap} />
          ))}
    </StyledInfiniteTable>
  )
}

export default PoolSwapsTab
