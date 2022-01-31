import { useMemo } from 'react'
import { Box, Flex, Text, Radio } from 'rimble-ui'
import Big from 'big.js'
import TokenIcon from 'src/components/common/TokenIcon'
import { ExtendedPoolToken, PoolToken } from 'src/shared/types/tokens'
import { prettifyBalance } from 'src/shared/utils'
import LiquidityInput from 'src/components/Liquidity/LiquidityInput'

interface RemoveSingleAssetRowProps {
  token: PoolToken
  checked?: boolean
  onSelect: (token: ExtendedPoolToken | 'all') => void
  onChange?: (value: number) => void
  value?: number
  multiple?: boolean
  sptToRemove: number
  disabled?: boolean
}

const RemoveSingleAssetRow = ({
  token,
  checked = false,
  value = 0,
  multiple = false,
  onSelect,
  onChange,
  sptToRemove,
  disabled = false,
}: RemoveSingleAssetRowProps) => {
  const tokenOutValue = useMemo(
    () => new Big(value).times(sptToRemove).div(100),
    [value, sptToRemove],
  )

  const usdValue = useMemo(
    () => tokenOutValue.times(token?.exchangeRate || 0),
    [tokenOutValue, token?.exchangeRate],
  )

  return (
    <li>
      <Flex
        width="100%"
        justifyContent="space-between"
        alignItems="center"
        height="96px"
        px={2}
      >
        <Flex alignItems="center">
          <Radio onChange={onSelect} checked={checked} disabled={disabled} />
          <TokenIcon
            disabled={disabled}
            height="28px"
            width="28px"
            symbol={token.symbol}
            name={token.name}
            mr={2}
          />
          <Flex flexDirection="column" color={disabled ? 'grey' : 'black'}>
            <Box>
              <Text.span fontWeight={5} lineHeight="24px">
                {token.symbol}{' '}
              </Text.span>
              <Text.span lineHeight="24px">{token.name}</Text.span>
            </Box>
            <Text.span
              color="grey"
              fontSize={1}
              lineHeight="20px"
              display={checked || multiple ? 'inline' : 'none'}
            >
              {prettifyBalance(new Big(value || 0), 4)} available to receive
            </Text.span>
          </Flex>
        </Flex>
        {checked && (
          <Flex flexDirection="column" alignItems="center">
            <LiquidityInput
              width="200px"
              min={0}
              max={100}
              value={sptToRemove}
              sliderOptions={{ variant: 'danger' }}
              onChange={onChange}
              endAdornment="%"
              disabled={disabled}
            />
            <Text.span
              px={3}
              width="100%"
              color="grey"
              fontSize={1}
              textAlign="right"
            >
              {prettifyBalance(tokenOutValue, 4)} {token.symbol} ($
              {prettifyBalance(usdValue)})
            </Text.span>
          </Flex>
        )}
        {multiple && (
          <Flex flexDirection="column">
            <Box textAlign="right">
              <Text.span fontWeight={5}>
                {prettifyBalance(tokenOutValue, 4)} {token.symbol}
              </Text.span>
            </Box>
            <Text.span color="grey" fontSize={1} textAlign="right">
              ${prettifyBalance(usdValue)}
            </Text.span>
          </Flex>
        )}
      </Flex>
    </li>
  )
}

export default RemoveSingleAssetRow
