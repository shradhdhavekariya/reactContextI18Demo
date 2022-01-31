import React, { SyntheticEvent, useState } from 'react'
import styled from 'styled-components'
import { ExpandMore, ExpandLess, Help } from '@rimble/icons'
import { Text, Flex, Button, Box, Tooltip } from 'rimble-ui'
import { PoolTokensRowProps, LiquidityActionType } from 'src/shared/types/props'
import { useTranslation } from 'react-i18next'
import TokenIcon from 'src/components/common/TokenIcon'
import { prettifyBalance } from 'src/shared/utils'
import LiquidityModals from 'src/components/Liquidity/LiquidityModals'
import { useHistory } from 'react-router'
import AssetRow from '../AssetRow'

const Content = styled.td<Record<string, unknown>>`
  display: ${({ expanded }) => (expanded ? 'block' : 'none')};
  opacity: ${({ hide }) => (hide ? '0' : '1')};
  transition: 0.1s;

  @media (min-width: ${({ theme }) => theme?.breakpoints[0]}) {
    display: table-cell;
  }
`

const PoolTokensRow = ({
  tokenToRender,
  rowIndex,
  hoveredIndex,
  setHoveredIndex,
  reload,
}: PoolTokensRowProps) => {
  const { name, symbol, userBalances, token } = tokenToRender
  const [expanded, setExpanded] = useState(false)
  const { t } = useTranslation('wallet')
  const history = useHistory()

  const [liquidityModalOpen, setLiquidityModalOpen] = useState<
    LiquidityActionType | ''
  >('')

  const handleExpand = (e: SyntheticEvent) => {
    e.stopPropagation()
    setExpanded((prev: boolean) => !prev)
  }
  const handleAddLiquidityClick = (e: SyntheticEvent) => {
    e.stopPropagation()
    setLiquidityModalOpen('add')
  }

  const handleRemoveLiquidityClick = (e: SyntheticEvent) => {
    e.stopPropagation()
    setLiquidityModalOpen('remove')
  }

  const handleLiquidityModalClose = () => setLiquidityModalOpen('')

  const handleRowClick = () => history.push(`/pool/${token.id}`)

  return (
    <AssetRow
      onMouseEnter={() => setHoveredIndex(rowIndex)}
      onMouseLeave={() => setHoveredIndex(-1)}
      onClick={handleRowClick}
    >
      <td>
        <Flex ml={2} alignItems="center">
          <TokenIcon symbol={symbol} name={name} width="32px" height="32px" />
          <Box flexGrow="1">
            <Text.span fontSize={2} fontWeight={5} ml="10px">
              {symbol}
            </Text.span>
            <Text.span fontSize={2} fontWeight={2} ml="8px">
              {name}
            </Text.span>
          </Box>
          <Box display={['block', 'none']} onClick={handleExpand}>
            {expanded ? (
              <ExpandLess color="near-black" />
            ) : (
              <ExpandMore color="near-black" />
            )}
          </Box>
        </Flex>
      </td>
      <Content expanded={expanded}>
        <Flex
          alignItems="center"
          justifyContent="flex-start"
          display={['flex', 'none']}
        >
          <Text fontSize={1} fontWeight={4} color="grey">
            {t('poolTokens.pooled')}
          </Text>
          <Tooltip placement="top" message={t('poolTokens.pooled')}>
            <Help size="15" ml={2} color="grey" />
          </Tooltip>
        </Flex>

        <Flex
          alignItems="center"
          justifyContent={['flex-start', 'flex-end']}
          mt={[1, 0]}
        >
          <Flex
            flexDirection={['center', 'column']}
            alignItems={['center', 'flex-end']}
            justifyContent="flex-start"
            width={['100%', 'fit-content']}
          >
            <Text fontSize={2} fontWeight={2} color={['near-black', 'black']}>
              {prettifyBalance(userBalances.ether)} {symbol}
            </Text>
            <Text fontSize={[2, 0]} fontWeight={3} color="grey" ml={[2, 0]}>
              {prettifyBalance(userBalances.usd, 0)} USD
            </Text>
          </Flex>
        </Flex>
      </Content>
      <Content expanded={expanded} hide={rowIndex !== hoveredIndex}>
        <Flex alignItems="center" justifyContent={['flex-start', 'flex-end']}>
          <Button height="28px" px={2} onClick={handleAddLiquidityClick}>
            {t('poolTokens.actions.addLiquidity')}
          </Button>
          <Button
            height="28px"
            px={2}
            ml={3}
            onClick={handleRemoveLiquidityClick}
          >
            {t('poolTokens.actions.removeLiquidity')}
          </Button>
        </Flex>
      </Content>
      <LiquidityModals
        pool={token.id}
        openModal={liquidityModalOpen}
        onClose={handleLiquidityModalClose}
        reload={reload}
      />
    </AssetRow>
  )
}

export default PoolTokensRow
