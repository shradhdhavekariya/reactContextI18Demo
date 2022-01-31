import { useMemo } from 'react'
import { Flex, Text } from 'rimble-ui'
import { prettifyBalance, recursiveRound } from 'src/shared/utils'
import { Share } from 'src/shared/types'
import Big from 'big.js'
import { formatBigInt } from 'src/shared/utils/formatting'
import { PoolToken } from 'src/shared/types/tokens'
import Blockie from 'src/components/common/Blockie'
import EtherscanLink from 'src/components/common/EtherscanLink'

interface PoolHoldersRowProps {
  shareInfo: Share & {
    sptValue: number
    totalShares: number
    poolToken: Partial<PoolToken>
  }
}

const PoolHoldersRow = ({ shareInfo }: PoolHoldersRowProps) => {
  const {
    balance,
    userAddress: user,
    sptValue,
    totalShares,
    poolToken,
  } = shareInfo

  const holder = useMemo(
    () => ({
      proxyAddress: user.isCpkId ? user.id : undefined,
      userAddress: user.isCpkId ? user.userAddress : user.id,
    }),
    [user],
  )

  return (
    <tr>
      <td>
        <Flex alignItems="center">
          <Blockie address={holder.userAddress} mr="16px" />
          <EtherscanLink type="address" hash={holder.userAddress} />
        </Flex>
      </td>
      <td>
        {holder.proxyAddress ? (
          <Flex alignItems="center">
            <Blockie address={holder.proxyAddress} mr="16px" />
            <EtherscanLink type="address" hash={holder.proxyAddress} />
          </Flex>
        ) : (
          '--'
        )}
      </td>
      <td>
        <Text.span title={prettifyBalance(balance)}>
          {formatBigInt(Number(balance))} {poolToken.symbol}
        </Text.span>
      </td>
      <td>
        <Text.span title={prettifyBalance(new Big(balance).times(sptValue))}>
          $ {formatBigInt(new Big(balance).toNumber() * sptValue)}
        </Text.span>
      </td>
      <td>
        <Text.span>
          {recursiveRound((100 / totalShares) * new Big(balance).toNumber())}%
        </Text.span>
      </td>
    </tr>
  )
}

export default PoolHoldersRow
