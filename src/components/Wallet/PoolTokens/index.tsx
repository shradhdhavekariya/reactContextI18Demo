import { SyntheticEvent, useContext, useEffect, useMemo, useState } from 'react'
import { Flex, Text, Tooltip, Box } from 'rimble-ui'
import { ExpandMore } from '@rimble/icons'
import { useTranslation } from 'react-i18next'
import { MarginProps } from 'styled-system'
import StyledTable from 'src/components/common/StyledTable'
import { usePoolTokens } from 'src/shared/hooks'
import { useReadyState, useAccount, useNetwork } from 'src/shared/web3'
import { useCpk } from 'src/cpk'
import { prettifyBalance, recursiveRound } from 'src/shared/utils'
import useUserAccount from 'src/shared/hooks/useUserAccount'
import { WalletContext } from '../WalletContext'
import PoolTokensHead from './PoolTokensHead'
import PoolTokensRow from './PoolTokensRow'
import WalletSection from '../WalletSection'
import InfoRow from '../InfoRow'
import InfoLink from '../InfoLink'

const PoolTokens = (props: MarginProps) => {
  const { selectedAccount, userUsdBalance, setPoolTokensBalance } = useContext(
    WalletContext,
  )
  const { t } = useTranslation('wallet')
  const account = useAccount()
  const cpk = useCpk()
  const ready = useReadyState()
  const userAccount = useUserAccount(selectedAccount)
  const { networkName } = useNetwork()

  const {
    allTokens: allPoolTokens,
    errors,
    loading: queryLoading,
    refetch,
  } = usePoolTokens({
    cpkAddress: userAccount?.cpkAddress,
  })

  const [amountToDisplay, setAmountToDisplay] = useState<number>(3)
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1)
  const loading = useMemo<boolean>(
    () => queryLoading || (!!account && !cpk?.address),
    [account, queryLoading, cpk?.address],
  )

  const balancesLoading = allPoolTokens.some(
    (token) => token.userBalances.loading,
  )

  const positivePoolTokens = useMemo(
    () =>
      allPoolTokens
        .filter(({ userBalances }) => userBalances.ether)
        .sort((a, b) => b.userBalances.usd - a.userBalances.usd),
    [allPoolTokens],
  )

  useEffect(() => {
    const rawTotal = positivePoolTokens.reduce(
      (total, { userBalances }) => total + userBalances.usd,
      0,
    )
    setPoolTokensBalance(recursiveRound<number>(rawTotal))
  }, [positivePoolTokens, setPoolTokensBalance])

  const onLoadMore = (event: SyntheticEvent) => {
    event.stopPropagation()
    setAmountToDisplay((displayed) => displayed + 3)
  }

  const disconnected = !account
  const dataLoading = !ready || loading || balancesLoading
  const hasError = !!errors.length
  const noResults = !hasError && !positivePoolTokens.length

  return (
    <WalletSection
      title={t('poolTokens.header', { network: networkName })}
      badge={
        <Text
          fontWeight={5}
          color="grey"
          fontSize={2}
          display={['block', 'none']}
        >
          {prettifyBalance(userUsdBalance.poolTokens)} USD
        </Text>
      }
      {...props}
    >
      <Box mt={[3, '24px']}>
        <StyledTable>
          <PoolTokensHead />
          <tbody>
            <InfoRow
              show={!dataLoading && noResults}
              loading={dataLoading && noResults}
              error={
                (disconnected && t('queryStatuses.noAccount')) ||
                (hasError && t('queryStatuses.error'))
              }
            >
              <>
                {t('poolTokens.noPools')}
                <InfoLink
                  internal
                  href="/pools"
                  title={t('poolTokens.actions.addLiquidity')}
                  target="_self"
                >
                  {t('poolTokens.actions.addLiquidity')}
                </InfoLink>
                {t('poolTokens.getStarted')}
              </>
            </InfoRow>
            {positivePoolTokens
              .slice(0, amountToDisplay)
              .map((token, index) => (
                <PoolTokensRow
                  key={token.id}
                  tokenToRender={token}
                  rowIndex={index}
                  hoveredIndex={hoveredIndex}
                  setHoveredIndex={setHoveredIndex}
                  reload={refetch}
                />
              ))}
          </tbody>
        </StyledTable>
        {positivePoolTokens.length > amountToDisplay && (
          <Flex alignItems="center" justifyContent="center" mt={3}>
            <Tooltip placement="top" message="Load more">
              <ExpandMore
                onClick={onLoadMore}
                cursor="pointer"
                color="near-black"
              />
            </Tooltip>
          </Flex>
        )}
      </Box>
    </WalletSection>
  )
}

export default PoolTokens
