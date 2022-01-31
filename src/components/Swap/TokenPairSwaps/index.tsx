import { useContext } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { useTranslation } from 'react-i18next'
import { Box, Card, Flex, Heading, Link, Text, Loader } from 'rimble-ui'
import { useReadyState, useAccount } from 'src/shared/web3'
import { SwapContext } from '../SwapContext'
import SwapRow from './SwapRow'

interface TokePairSwapsProps {
  tokenPair?: [string, string]
}

const TokenPairSwaps = ({ tokenPair }: TokePairSwapsProps) => {
  const { t } = useTranslation('swap')
  const account = useAccount()
  const ready = useReadyState()

  const {
    swaps: { data, loading: swapsLoading, fetchMore, hasMore },
  } = useContext(SwapContext)

  const notConnected = !account
  const noPair = !tokenPair
  const loading = swapsLoading || !ready
  const noResults = data?.swaps.length === 0

  return (
    <>
      <Card
        mt={3}
        p={['16px', '24px']}
        borderRadius={1}
        boxShadow={4}
        border="0"
        display="flex"
        flexDirection="column"
      >
        <Flex
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Heading
            as="h3"
            fontSize={3}
            lineHeight="28px"
            fontWeight={5}
            color="grey"
            m={0}
          >
            {t('recentSwaps.header')}
          </Heading>
          <Link
            href="/wallet"
            color="primary"
            hoverColor="primary-dark"
            fontSize={2}
            fontWeight={2}
            display="none"
          >
            {t('recentSwaps.viewAllTransactions')}
          </Link>
        </Flex>
        <Box mt="28px">
          {notConnected && !loading && (
            <Text.span color="grey" fontWeight={3}>
              {t('recentSwaps.notConnected')}
            </Text.span>
          )}
          {noPair && !loading && (
            <Text.span color="grey" fontWeight={3}>
              {t('recentSwaps.noTokenPair')}
            </Text.span>
          )}
          {noResults && !loading && (
            <Text.span color="grey" fontWeight={3}>
              {t('recentSwaps.noSwap')}
            </Text.span>
          )}
          <InfiniteScroll
            pageStart={0}
            loadMore={fetchMore}
            hasMore={hasMore}
            initialLoad={false}
            threshold={10}
            useWindow
          >
            {!noResults &&
              data?.swaps.map((swap) => <SwapRow swap={swap} key={swap.id} />)}
            {loading && (
              <Flex key={0}>
                <Loader mx="auto" mt={2} />
              </Flex>
            )}
          </InfiniteScroll>
        </Box>
      </Card>
    </>
  )
}

export default TokenPairSwaps
