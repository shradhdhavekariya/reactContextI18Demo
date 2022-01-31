import React, { useMemo } from 'react'
import { PoolToken, PoolTokenInfo } from 'src/shared/types/tokens'
import styled from 'styled-components'
import useDeepTranslation from 'src/hooks/useDeepTranslation'
import Big from 'big.js'
import { layout, LayoutProps, textAlign, TextAlignProps } from 'styled-system'
import StyledTable from 'src/components/common/StyledTable'
import PoolBalanceRow from './PoolBalanceRow'

const Th = styled.th<LayoutProps & TextAlignProps>`
  ${layout}
  ${textAlign}
`

interface PoolBalancesTabProps {
  tokens: PoolToken[]
  myPoolShare: number
}

const PoolBalancesTab = ({ tokens, myPoolShare }: PoolBalancesTabProps) => {
  const { t } = useDeepTranslation('poolDetails', [
    'poolTabs',
    'balances',
    'th',
  ])

  const tokensInfo = useMemo<PoolTokenInfo[]>(
    () =>
      tokens.map(
        ({ address, name, symbol, poolBalance, exchangeRate, weight }) => ({
          address,
          name,
          symbol,
          poolBalance,
          userBalance: new Big(poolBalance || 0).times(myPoolShare).toNumber(),
          userAssetValue: new Big(poolBalance || 0)
            .times(myPoolShare)
            .times(exchangeRate || 0)
            .toNumber(),
          weight: (weight || 0) * 100,
        }),
      ),
    [tokens, myPoolShare],
  )

  return (
    <StyledTable>
      <thead>
        <tr>
          <Th>{t('assets')}</Th>
          <Th width="120px" textAlign="right">
            {t('weight')}
          </Th>
          <Th width="120px" display={['none', 'table-cell']} textAlign="right">
            {t('poolBalance')}
          </Th>
          <Th width="120px" display={['none', 'table-cell']} textAlign="right">
            {t('myBalance')}
          </Th>
          <Th width="150px" display={['none', 'table-cell']} textAlign="right">
            {t('myAssetValue')}
          </Th>
        </tr>
      </thead>
      <tbody>
        {tokensInfo.map((tokenInfo) => (
          <PoolBalanceRow key={tokenInfo.address} {...tokenInfo} />
        ))}
      </tbody>
    </StyledTable>
  )
}

export default PoolBalancesTab
