import styled from 'styled-components'
import { Flex, Text } from 'rimble-ui'
import TokenIcon from 'src/components/common/TokenIcon'
import { prettifyBalance, recursiveRound } from 'src/shared/utils'
import { PoolTokenInfo } from 'src/shared/types/tokens'
import { formatBigInt } from 'src/shared/utils/formatting'
import Big from 'big.js'
import { layout, LayoutProps } from 'styled-system'
import EtherscanLink from 'src/components/common/EtherscanLink'

const Td = styled.td<LayoutProps>`
  ${layout}
`

const PoolBalanceRow = ({
  name,
  symbol,
  weight,
  poolBalance,
  userBalance,
  userAssetValue,
  address,
}: PoolTokenInfo) => (
  <tr>
    <Td>
      <Flex ml={2} alignItems="center">
        <TokenIcon
          symbol={symbol}
          name={name}
          width="20px"
          height="20px"
          mr="10px"
        />
        <Text.span fontSize={2} fontWeight={5}>
          {symbol}
        </Text.span>
        <Text.span fontSize={2} fontWeight={2} ml="8px">
          {name}
        </Text.span>
        <EtherscanLink type="token" hash={address} label="" />
      </Flex>
    </Td>
    <Td>
      <Text fontSize={2} fontWeight={2} color="black" textAlign="right">
        {recursiveRound(weight)}%
      </Text>
    </Td>
    <Td display={['none', 'table-cell']}>
      <Text
        title={prettifyBalance(new Big(poolBalance || 0))}
        fontSize={2}
        fontWeight={2}
        color="black"
        textAlign="right"
      >
        {formatBigInt(new Big(poolBalance || 0).toNumber())}
      </Text>
    </Td>
    <Td display={['none', 'table-cell']}>
      <Text
        title={prettifyBalance(userBalance)}
        fontSize={2}
        fontWeight={2}
        color="black"
        textAlign="right"
      >
        {formatBigInt(userBalance)}
      </Text>
    </Td>
    <Td display={['none', 'table-cell']}>
      <Text
        title={prettifyBalance(userAssetValue)}
        fontSize={2}
        fontWeight={2}
        color="black"
        textAlign="right"
      >
        ${formatBigInt(userAssetValue)}
      </Text>
    </Td>
  </tr>
)

export default PoolBalanceRow
