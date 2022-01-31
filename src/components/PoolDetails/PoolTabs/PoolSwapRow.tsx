import { useMemo } from 'react'
import { format, fromUnixTime } from 'date-fns'
import { Flex, Text } from 'rimble-ui'
import TokenIcon from 'src/components/common/TokenIcon'
import { prettifyBalance } from 'src/shared/utils'
import { Swap } from 'src/shared/types'
import styled from 'styled-components'
import { layout, LayoutProps } from 'styled-system'
import EtherscanLink from 'src/components/common/EtherscanLink'
import { formatBigInt } from 'src/shared/utils/formatting'

const Td = styled.td<LayoutProps>`
  ${layout}
`

const PoolSwapRow = ({
  timestamp,
  tokenInSym,
  tokenAmountIn,
  tokenAmountOut,
  tokenOutSym,
  feeValue,
  id,
}: Swap) => {
  const txHash = useMemo(() => id.split('-')[0], [id])

  return (
    <tr>
      <Td>
        <Text.span
          fontSize={2}
          fontWeight={2}
          color="near-black"
          display={['none', 'none', 'none', 'inline']}
        >
          {format(fromUnixTime(timestamp), 'MMMM dd, yyyy hh:mm aa')}
        </Text.span>
      </Td>
      <Td>
        <Flex
          alignItems="center"
          justifyContent={[
            'flex-start',
            'flex-start',
            'flex-start',
            'flex-end',
          ]}
        >
          <Text.span
            title={prettifyBalance(tokenAmountIn, 6)}
            fontSize={2}
            fontWeight={2}
          >
            {formatBigInt(Number(tokenAmountIn))}
          </Text.span>
          <Text.span fontSize={2} fontWeight={5} ml={2}>
            {tokenInSym}
          </Text.span>
          <TokenIcon ml={2} symbol={tokenInSym} width="20px" height="20px" />
        </Flex>
      </Td>
      <Td>
        <Flex alignItems="center" justifyContent="flex-end">
          <Text.span
            title={prettifyBalance(tokenAmountOut, 6)}
            fontSize={2}
            fontWeight={2}
          >
            {formatBigInt(Number(tokenAmountOut))}
          </Text.span>
          <Text.span fontSize={2} fontWeight={5} ml={2}>
            {tokenOutSym}
          </Text.span>
          <TokenIcon ml={2} symbol={tokenOutSym} width="20px" height="20px" />
        </Flex>
      </Td>
      <Td>
        <Flex justifyContent="flex-end">
          <EtherscanLink type="tx" hash={txHash} />
        </Flex>
      </Td>
      <Td>
        <Flex justifyContent="flex-end">
          <Text.span
            title={prettifyBalance(feeValue)}
            fontSize={2}
            fontWeight={2}
          >
            ${formatBigInt(Number(feeValue), 2)}
          </Text.span>
        </Flex>
      </Td>
    </tr>
  )
}

export default PoolSwapRow
