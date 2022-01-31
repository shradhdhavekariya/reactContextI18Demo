import { useCallback } from 'react'
import { PoolExpanded } from 'src/shared/types'
import { Box, Icon, Link, Text } from 'rimble-ui'
import styled from 'styled-components'
import { PoolType } from 'src/shared/enums'
import { capitalize } from 'src/shared/utils/lodash'
import { generateEtherscanUrl, truncateStringInTheMiddle } from 'src/utils'
import { format, fromUnixTime } from 'date-fns'
import Big from 'big.js'
import { prettifyBalance } from 'src/shared/utils'
import { formatBigInt } from 'src/shared/utils/formatting'
import useDeepTranslation from 'src/hooks/useDeepTranslation'
import Grid from 'src/components/common/Grid'
import Blockie from 'src/components/common/Blockie'
import { useNetworkId } from 'src/shared/web3'

const StyledLabel = styled(Text)`
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.grey};
`

const StyledText = styled(Text)`
  word-break: break-all;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  margin-top: 4px;
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  color: ${({ theme }) => theme.colors.black};
`

const StyledLink = styled(Link)`
  text-decoration: none !important;
  color: ${({ theme }) => theme.colors['near-black']};
  word-break: break-all;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  margin-top: 4px;
  align-items: center;
  display: flex;

  &:hover,
  &:active,
  &:focus,
  &.active {
    opacity: 1;
    color: ${({ theme }) => theme.colors.grey};
  }
`

export interface PoolAboutTabProps extends PoolExpanded {
  poolType: PoolType
}

const PoolAboutTab = ({
  poolType,
  controller,
  createTime,
  id,
  publicSwap,
  totalShares,
  totalSwapFee,
  totalSwapVolume,
  tokens,
  tx,
}: PoolAboutTabProps) => {
  const networkId = useNetworkId()
  const { t } = useDeepTranslation('poolDetails', ['poolTabs', 'about'])

  const prettifyPoolTypeName = (value: PoolType) =>
    value === PoolType['my-pools'] ? 'My pool' : capitalize(value)

  const generateUrl = useCallback(
    (type: string, hash: string) =>
      networkId ? generateEtherscanUrl({ type, hash, chainId: networkId }) : '',
    [networkId],
  )

  return (
    <Grid
      gridTemplateColumns={['1fr', '1fr 1fr 1fr']}
      gridGap={['16px', '32px']}
      mt="8px"
    >
      <Box>
        <StyledLabel>{t('poolType')}</StyledLabel>
        <StyledText>{prettifyPoolTypeName(poolType)}</StyledText>
      </Box>
      <Box>
        <StyledLabel>{t('creator')}</StyledLabel>
        <StyledLink
          href={generateUrl('token', controller)}
          target="_blank"
          textOverflow="ellipsis"
        >
          <Blockie address={controller} mr="16px" />
          {truncateStringInTheMiddle(controller)}
          <Icon name="Launch" size="16px" ml="6px" />
        </StyledLink>
      </Box>
      <Box>
        <StyledLabel>{t('creationDate')}</StyledLabel>
        <StyledLink
          href={generateUrl('tx', tx)}
          target="_blank"
          textOverflow="ellipsis"
        >
          {format(fromUnixTime(createTime), 'MMM dd, yyyy hh:mm aa')}
          <Icon name="Launch" size="16px" ml="6px" />
        </StyledLink>
      </Box>
      <Box>
        <StyledLabel>{t('sptAsset')}</StyledLabel>
        <StyledLink
          href={generateUrl('token', id)}
          target="_blank"
          textOverflow="ellipsis"
        >
          <Blockie address={id} mr="16px" />
          {truncateStringInTheMiddle(id)}
          <Icon name="Launch" size="16px" ml="6px" />
        </StyledLink>
      </Box>
      <Box>
        <StyledLabel>{t('sptTotalSupply')}</StyledLabel>
        <StyledText title={prettifyBalance(totalShares)}>
          {formatBigInt(Number(totalShares))}
        </StyledText>
      </Box>
      <Box>
        <StyledLabel>{t('assetInfo')}</StyledLabel>
        <StyledText>
          {tokens.map(({ xToken }) => (
            <StyledLink
              key={xToken?.id}
              href={generateUrl('token', xToken?.id || '')}
              target="_blank"
              textOverflow="ellipsis"
              mr="14px"
            >
              {xToken?.symbol}
              <Icon name="Launch" size="16px" ml="6px" />
            </StyledLink>
          ))}
        </StyledText>
      </Box>
      <Box>
        <StyledLabel>{t('publicSwap')}</StyledLabel>
        <StyledText>{publicSwap ? 'Enabled' : 'Disabled'}</StyledText>
      </Box>
      <Box>
        <StyledLabel>{t('totalSwapVolume')}</StyledLabel>
        <StyledText title={prettifyBalance(new Big(totalSwapVolume))}>
          $ {formatBigInt(new Big(totalSwapVolume).toNumber())}
        </StyledText>
      </Box>
      <Box>
        <StyledLabel>{t('totalSwapFee')}</StyledLabel>
        <StyledText title={prettifyBalance(new Big(totalSwapFee))}>
          $ {formatBigInt(new Big(totalSwapFee).toNumber())}
        </StyledText>
      </Box>
    </Grid>
  )
}

export default PoolAboutTab
