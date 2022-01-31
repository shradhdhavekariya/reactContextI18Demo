import React, { forwardRef } from 'react'
import { Loader, Flex } from 'rimble-ui'
import styled from 'styled-components'
import InfiniteScroll from 'react-infinite-scroller'
import useForwardedRef from 'src/hooks/useForwardedRef'
import Table from 'src/components/common/StyledTable'

const StyledTable = styled(Table)<{ height?: string }>`
  table-layout: fixed;
  overflow: auto;

  th,
  td {
    overflow: hidden;
    text-align: left;
    padding: 12px 8px;
  }

  th {
    position: sticky;
  }

  td {
    scroll-snap-align: start;
  }
`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TableWrapper = styled.div<any>`
  overflow: auto;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
`

interface InfiniteTableProps {
  colgroup: React.ReactNode
  head: React.ReactNode
  children: React.ReactChild[]
  noResults: React.ReactNode
  hasMore: boolean
  loading: boolean
  loadMore: () => void
  className?: string
  totalCols?: number
}

const InfiniteTable = forwardRef<HTMLDivElement, InfiniteTableProps>(
  (
    {
      colgroup,
      head,
      children,
      noResults,
      loading,
      hasMore,
      loadMore,
      className,
      totalCols = 7,
    }: InfiniteTableProps,
    ref,
  ) => {
    const scrollParentRef = useForwardedRef<HTMLDivElement>(ref)

    return (
      <Flex flexDirection="column" justifyContent="stretch" overflow="hidden">
        <StyledTable className={className}>
          {colgroup}
          {!!head && <thead>{head}</thead>}
        </StyledTable>
        <TableWrapper ref={scrollParentRef}>
          <StyledTable className={className} height="auto">
            {colgroup}
            <InfiniteScroll
              pageStart={0}
              loadMore={loadMore}
              hasMore={hasMore}
              element="tbody"
              initialLoad={false}
              threshold={10}
            >
              {!loading && !children?.length ? noResults : children}
              {loading && (
                <tr key="loading">
                  <td colSpan={totalCols}>
                    <Loader m="auto" />
                  </td>
                </tr>
              )}
            </InfiniteScroll>
          </StyledTable>
        </TableWrapper>
      </Flex>
    )
  },
)

InfiniteTable.displayName = 'InfiniteTable'

export default InfiniteTable
