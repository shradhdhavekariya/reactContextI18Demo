import Big from 'big.js'
import { Text, Flex } from 'rimble-ui'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { formatBigInt } from 'src/shared/utils/formatting'
import { PoolExpanded } from 'src/shared/types'
import { normalizedPoolTokens, truncateStringInTheMiddle } from 'src/utils'
import { layout, LayoutProps } from 'styled-system'
import { big, ZERO } from 'src/shared/utils/big-helpers'
import { prettifyBalance, recursiveRound } from 'src/shared/utils'
import { isPoolForExtraReward } from 'src/shared/utils/pool-calc'
import { calculateVolume } from 'src/shared/utils/pool'
import { ReactComponent as ExtraRewards } from 'src/assets/icons/ExtraRewards.svg'
import AssetIcons from './AssetIcons'

const Td = styled.td<LayoutProps>`
  ${layout}
`

interface PoolRowProps {
  pool: PoolExpanded
}

const PoolRow = ({ pool }: PoolRowProps) => {
  const {
    id: poolId,
    swaps,
    totalShares,
    totalSwapVolume,
    cpkBalance,
    marketCap,
  } = pool

  const bigTotalShares = big(totalShares)

  const bigCpkBalance = cpkBalance || ZERO

  const userPoolSharePercent = bigTotalShares.eq(0)
    ? 0
    : bigCpkBalance.div(bigTotalShares).toNumber()

  const volume = calculateVolume(totalSwapVolume, swaps).toNumber()

  const isExtraRewards = isPoolForExtraReward(pool)

  return (
    <tr>
      <Td title={poolId}>
        <Link to={`/pool/${poolId}`} style={{ textDecoration: 'none' }}>
          <Text.span color="near-black">
            {truncateStringInTheMiddle(poolId)}
          </Text.span>
        </Link>
      </Td>
      <Td>
        <Link to={`/pool/${poolId}`} style={{ textDecoration: 'none' }}>
          <AssetIcons assets={pool.tokens} />
        </Link>
      </Td>
      <Td>
        <Link to={`/pool/${poolId}`} style={{ textDecoration: 'none' }}>
          <Flex flexWrap="wrap">
            {normalizedPoolTokens(pool.tokens).map((token) => (
              <Text.span key={token.address} mr={2} color="black">
                <Text.span fontWeight={5}>{`${new Big(token.weight)
                  .round(0, 2)
                  .toString()}% `}</Text.span>
                {token.symbol}
              </Text.span>
            ))}
          </Flex>
        </Link>
      </Td>
      <Td style={{ textAlign: 'center' }}>
        {isExtraRewards && (
          <Link to={`/pool/${poolId}`} style={{ textDecoration: 'none' }}>
            <ExtraRewards />
          </Link>
        )}
      </Td>
      <Td>{new Big(pool.swapFee).times(100).toString()}%</Td>
      <Td title={prettifyBalance(marketCap || 0)}>
        {marketCap === null ? '--' : `$${formatBigInt(marketCap || 0)}`}
      </Td>
      <Td>{recursiveRound(userPoolSharePercent * 100, { base: 1 })}%</Td>
      <Td title={prettifyBalance(volume)}>${formatBigInt(volume)}</Td>
    </tr>
  )
}

export default PoolRow
