import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { Tabs } from '@material-ui/core'
import { Box } from 'rimble-ui'
import match from 'conditional-expression'
import StyledTab from 'src/components/common/StyledTab'
import Big from 'big.js'
import styled from 'styled-components'
import useDeepTranslation from 'src/hooks/useDeepTranslation'
import { PoolType } from 'src/shared/enums'
import { PoolExpanded } from 'src/shared/types'
import { PoolToken } from 'src/shared/types/tokens'
import PoolBalancesTab from './PoolBalancesTab'
import PoolSwapsTab from './PoolSwapsTab'
import PoolHoldersTab from './PoolHoldersTab'
import PoolAboutTab from './PoolAboutTab'

export interface PoolTabsProps {
  poolType: PoolType
  pool: PoolExpanded
  liquidity: number
  poolToken: Partial<PoolToken>
  myPoolShare: number
}

const TabPanel = styled(Box)`
  border-top: 1px solid ${({ theme }) => theme.colors['light-gray']};
`

const PoolTabs = ({
  pool,
  poolType,
  poolToken,
  myPoolShare,
  liquidity,
}: PoolTabsProps) => {
  const { t } = useDeepTranslation('poolDetails', ['poolTabs', 'th'])
  const [currentPoolTabIndex, setCurrentPoolTabIndex] = useState(0)
  const { tokens, id, totalShares, holdersCount, swapsCount } = pool

  const swapsNumber = useMemo(() => new Big(swapsCount).toNumber(), [
    swapsCount,
  ])

  const holdersNumber = useMemo(() => new Big(holdersCount).toNumber(), [
    holdersCount,
  ])

  const handleSwitchTab = useCallback(
    // eslint-disable-next-line @typescript-eslint/ban-types
    (e: ChangeEvent<{}>, index: number) => {
      if (index !== currentPoolTabIndex) {
        setCurrentPoolTabIndex(index)
      }
    },
    [currentPoolTabIndex],
  )

  return (
    <Box mt="24px">
      <Tabs
        value={currentPoolTabIndex}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleSwitchTab}
        aria-label="pool tabs"
      >
        <StyledTab label={t('balances')} amountIn={tokens.length} value={0} />
        {swapsNumber && (
          <StyledTab label={t('swaps')} amountIn={swapsNumber} value={1} />
        )}
        {holdersNumber && (
          <StyledTab label={t('holders')} amountIn={holdersNumber} value={2} />
        )}
        <StyledTab label={t('about')} value={3} />
      </Tabs>
      <TabPanel role="tabpanel" pt="16px">
        {match(currentPoolTabIndex)
          .equals(0)
          .then(<PoolBalancesTab myPoolShare={myPoolShare} tokens={tokens} />)
          .equals(1)
          .then(<PoolSwapsTab poolAddress={id} />)
          .equals(2)
          .then(
            <PoolHoldersTab
              poolAddress={id}
              liquidity={liquidity}
              totalShares={new Big(totalShares).toNumber()}
              poolToken={poolToken}
            />,
          )
          .equals(3)
          .then(<PoolAboutTab {...pool} poolType={poolType} />)
          .else(null)}
      </TabPanel>
    </Box>
  )
}

export default PoolTabs
