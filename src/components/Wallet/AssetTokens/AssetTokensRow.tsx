import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { ExpandLess, ExpandMore, Help } from '@rimble/icons'
import { Box, Button, Flex, Loader, Text, Tooltip } from 'rimble-ui'
import { useTranslation } from 'react-i18next'
import {
  AssetTokenActionsProps,
  AssetTokenRowProps,
} from 'src/shared/types/props'
import TokenIcon from 'src/components/common/TokenIcon'
import { usePooledToken } from 'src/shared/hooks'
import { prettifyBalance } from 'src/shared/utils'
import AllowanceIndicator from 'src/components/common/AllowanceIndicator'
import Balance from 'src/components/common/Balance'
import { ReactComponent as UnwrapIcon } from 'src/assets/icons/Unwrap.svg'
import { VSMT } from 'src/contracts/VSMT'
import useAsyncMemo from 'src/hooks/useAsyncMemo'
import blotout from 'src/services/blotout'
import AssetTokenActions from './AssetTokenActions'
import AssetRow from '../AssetRow'

const Content = styled.td<Record<string, unknown>>`
  display: ${({ expanded }) => (expanded ? 'block' : 'none')};
  opacity: ${({ hide }) => (hide ? '0' : '1')};
  transition: 0.1s;

  @media (min-width: ${({ theme }) => theme?.breakpoints[0]}) {
    display: table-cell;
  }
`

const AssetTokenRow = ({
  tokenToRender,
  rowIndex,
  hoveredIndex,
  disableActions = false,
  selectedAccount,
  setHoveredIndex,
}: AssetTokenRowProps) => {
  const { t } = useTranslation('wallet')
  const [expanded, setExpanded] = useState(false)
  const {
    name,
    symbol,
    userBalances,
    xToken,
    exchangeRate,
    allowanceStatus,
    cpkAllowance,
    id,
    ...rest
  } = tokenToRender

  const {
    pooledTokens,
    loading: pooledTokensLoading,
    fetched: pooledFetched,
  } = usePooledToken(xToken ? xToken.address : '', selectedAccount)

  const [claimableAmount] = useAsyncMemo(
    async () =>
      !xToken && selectedAccount?.address
        ? VSMT.getClaimableAmount(selectedAccount.address)
        : 0,
    0,
    [xToken, selectedAccount?.address],
  )

  const pooledTokenBalance = useMemo(() => {
    if (
      (!pooledFetched && pooledTokensLoading) ||
      pooledTokens.some((token) => typeof token.balance === 'undefined')
    ) {
      return undefined
    }

    return pooledTokens.reduce(
      (acc, pooledToken) => acc + (pooledToken?.balance || 0),
      0,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pooledFetched, pooledTokens, pooledTokensLoading])

  const handleExpand = () => {
    setExpanded((prev: boolean) => !prev)
  }

  const tokenActions: AssetTokenActionsProps = {
    allowanceStatus,
    name,
    symbol,
    ...rest,
    address: id,
  }

  const onWrapVSMT = async () => {
    if (!xToken && selectedAccount?.address) {
      await VSMT.claimMaximumAmount(selectedAccount?.address)
      blotout.captureUnwrapVSmt(claimableAmount)
    }
  }

  return (
    <AssetRow
      onMouseEnter={() => setHoveredIndex(rowIndex)}
      onMouseLeave={() => setHoveredIndex(-1)}
    >
      <td>
        <Flex ml={2} alignItems="center" onClick={handleExpand}>
          <TokenIcon symbol={symbol} name={name} width="32px" height="32px" />
          <Box flexGrow="1">
            <Text.span fontSize={2} fontWeight={5} ml="10px">
              {symbol}
            </Text.span>
            <Text.span fontSize={2} fontWeight={2} ml="8px">
              {name}
            </Text.span>
            <Text.span ml={1}>
              <AllowanceIndicator allowanceStatus={allowanceStatus} />
            </Text.span>
          </Box>
          <Box display={['block', 'none']}>
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
            {t('assetTokens.native')}
          </Text>
          <Tooltip placement="top" message={t('assetTokens.native')}>
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
              <Balance
                tokenAddress={id}
                account={selectedAccount?.address}
                symbol={symbol}
              />
            </Text>
            <Text fontSize={[2, 0]} fontWeight={3} color="grey" ml={[2, 0]}>
              <Balance
                tokenAddress={tokenToRender?.id}
                account={selectedAccount?.address}
                symbol="USD"
                usd
              />
            </Text>
          </Flex>
        </Flex>
      </Content>
      <Content expanded={expanded}>
        <Flex
          alignItems="center"
          justifyContent="flex-start"
          display={['flex', 'none']}
        >
          <Text fontSize={1} fontWeight={4} color="grey">
            {t('assetTokens.pooled')}
          </Text>
          <Tooltip placement="top" message={t('assetTokens.pooled')}>
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
            {' '}
            {/* eslint-disable-next-line no-nested-ternary */}
            {typeof pooledTokenBalance === 'undefined' ? (
              <Loader />
            ) : selectedAccount ? (
              <>
                <Text
                  fontSize={2}
                  fontWeight={2}
                  color={['near-black', 'black']}
                >
                  {prettifyBalance(pooledTokenBalance || 0, 6)} {xToken?.symbol}
                </Text>
                <Text fontSize={[2, 0]} fontWeight={3} color="grey" ml={[2, 0]}>
                  {prettifyBalance((pooledTokenBalance || 0) * exchangeRate, 0)}{' '}
                  USD
                </Text>
              </>
            ) : (
              '--'
            )}
          </Flex>
        </Flex>
      </Content>
      {!disableActions && xToken && (
        <Content expanded={expanded} hide={rowIndex !== hoveredIndex}>
          <Flex alignItems="center" justifyContent={['flex-start', 'flex-end']}>
            <AssetTokenActions {...tokenActions} />
          </Flex>
        </Content>
      )}
      {!xToken && (
        <Content expanded={expanded} hide={rowIndex !== hoveredIndex}>
          <Flex alignItems="center" justifyContent={['flex-start', 'flex-end']}>
            <Button
              height="28px"
              px={2}
              ml={3}
              onClick={onWrapVSMT}
              disabled={claimableAmount === 0}
            >
              <Text.span mr={1} lineHeight="20px">
                <UnwrapIcon height="12px" width="12px" />
              </Text.span>
              <Text.span fontWeight={3} lineHeight="20px">
                {t('assetTokens.actions.unwrap')} ({claimableAmount})
              </Text.span>
            </Button>
          </Flex>
        </Content>
      )}
    </AssetRow>
  )
}

export default AssetTokenRow
