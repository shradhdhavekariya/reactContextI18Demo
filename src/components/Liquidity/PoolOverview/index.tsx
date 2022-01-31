import React from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Text } from 'rimble-ui'
import Big from 'big.js'
import { truncateStringInTheMiddle } from 'src/utils'
import { recursiveRound } from 'src/shared/utils'
import { PoolOverviewProps } from 'src/shared/types/props'
import { LiquidityActionColor } from 'src/shared/enums'
import LiquidityPieChart from '../LiquidityPieChart'
import H4 from '../H4'
import Block from './Block'

const PoolOverview = ({
  tokens,
  poolTokensToIssue,
  userPoolTokenBalance: myBalance,
  totalShares,
  swapFee,
  id: poolId,
  action,
}: PoolOverviewProps) => {
  const { t } = useTranslation('liquidityModals')
  const isAddLiquidity = action === 'add'

  const bigTotalShares = new Big(totalShares)

  const mySharePercent = bigTotalShares.eq(0)
    ? '0'
    : recursiveRound(myBalance.div(bigTotalShares).times(100))

  const [newShare, newTotalShares] = isAddLiquidity
    ? [myBalance.add(poolTokensToIssue), bigTotalShares.add(poolTokensToIssue)]
    : [myBalance.sub(poolTokensToIssue), bigTotalShares.sub(poolTokensToIssue)]

  const newSharePercentage =
    newTotalShares.eq(0) || newShare.eq(0)
      ? 0
      : recursiveRound(newShare.div(newTotalShares).times(100))

  return (
    <Box
      width="200px"
      borderRight="1px solid"
      borderColor="light-gray"
      pr="24px"
    >
      <H4 text={t('poolOverview')} />
      <Block title={t('poolAddress')}>
        <Text color="black" title={poolId} lineHeight="24px">
          {truncateStringInTheMiddle(poolId)}
        </Text>
      </Block>
      <Block title={t('yourShare')}>
        <Text.span color="black" lineHeight="24px">
          {recursiveRound(mySharePercent)}%
        </Text.span>
        <Text.span
          color={!!action && LiquidityActionColor[action]}
          fontWeight={5}
          lineHeight="24px"
          opacity={mySharePercent === newSharePercentage ? 0 : 1}
        >
          {' -> '} {newSharePercentage}%
        </Text.span>
      </Block>
      <Block title={t('swapFee')}>
        <Text.span color="black" lineHeight="24px">
          {swapFee ? Number(swapFee) * 100 : '-'}%
        </Text.span>
      </Block>
      <LiquidityPieChart tokens={tokens} />
    </Box>
  )
}

export default PoolOverview
