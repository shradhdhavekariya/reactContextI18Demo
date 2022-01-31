import { useTranslation } from 'react-i18next'
import { useCallback, useMemo } from 'react'
import { Box, Flex, Text, Radio } from 'rimble-ui'
import Big from 'big.js'
import { useField } from 'formik'
import { BALANCE_BUFFER } from 'src/shared/consts'
import { compareAllowanceWithBalance, prettifyBalance } from 'src/shared/utils'
import TokenIcon from 'src/components/common/TokenIcon'
import { ExtendedPoolToken } from 'src/shared/types/tokens'
import AllowanceIndicator from 'src/components/common/AllowanceIndicator'
import LiquidityInput from 'src/components/Liquidity/LiquidityInput'
import { isLessThan } from './validation'

interface AddSingleAssetRowProps {
  token: ExtendedPoolToken
  checked?: boolean
  onSelect: (token: ExtendedPoolToken | 'all') => void
  onChange?: (value: number) => void
  value?: number
  multiple?: boolean
  disabled?: boolean
}

const AddSingleAssetRow = ({
  checked = false,
  disabled = false,
  multiple = false,
  token,
  value,
  onSelect,
  onChange,
}: AddSingleAssetRowProps) => {
  const { t } = useTranslation(['liquidityModals', 'navigation'])

  const numberBalance = token.balance?.round(4, 1).toNumber() || 0

  const maxAllowed = Math.min(
    numberBalance,
    ((1 - BALANCE_BUFFER) * Number(token.poolBalance || 0)) / 2,
  )

  const [field, , helpers] = useField({
    name: `liquidityIn.${token.address}`,
    validate: isLessThan(maxAllowed, t('errors.poolLimitExceeded')),
    disabled: !checked,
  })

  const handleOnChange = (val: number) => {
    onChange?.(val)
    helpers.setValue(val)
  }

  const handleOnSelect = useCallback(() => onSelect(token), [onSelect, token])

  const roundedValue = new Big(value || 0).round(4, 1).toNumber()

  const usdValue = new Big(value || 0)
    .times(token?.exchangeRate || 0)
    .round(2, 1)
    .toNumber()

  const realDisabled = disabled || numberBalance === 0

  const allowanceStatus = useMemo(
    () =>
      compareAllowanceWithBalance(token.balance || 0, token.cpkAllowance || 0),
    [token.balance, token.cpkAllowance],
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
          <Radio
            onChange={handleOnSelect}
            checked={checked}
            disabled={realDisabled}
          />
          <TokenIcon
            height="28px"
            width="28px"
            symbol={token.symbol}
            name={token.name}
            mr={2}
            disabled={realDisabled}
          />
          <Flex flexDirection="column" color={realDisabled ? 'grey' : 'black'}>
            <Box>
              <Text.span fontWeight={5} lineHeight="24px">
                {token.symbol}
              </Text.span>{' '}
              <Text.span lineHeight="24px">{token.name}</Text.span>
              <Text.span ml={1}>
                {token && (
                  <AllowanceIndicator allowanceStatus={allowanceStatus} />
                )}
              </Text.span>
            </Box>
            <Text.span color="grey" fontSize={1} lineHeight="20px">
              {prettifyBalance(numberBalance, 4)} available
            </Text.span>
          </Flex>
        </Flex>
        {checked && (
          <Flex flexDirection="column" alignItems="center">
            <LiquidityInput
              width="200px"
              max={Math.min(
                numberBalance,
                ((1 - BALANCE_BUFFER) * Number(token.poolBalance || 0)) / 2,
              )}
              min={0}
              value={field.value}
              sliderOptions={{ step: 0.0001 }}
              onChange={handleOnChange}
              disabled={realDisabled}
            />
            <Text.span
              px={3}
              width="100%"
              color="grey"
              fontSize={1}
              textAlign="right"
            >
              ${prettifyBalance(usdValue)}
            </Text.span>
          </Flex>
        )}
        {multiple && (
          <Flex flexDirection="column">
            <Box textAlign="right">
              <Text.span fontWeight={5}>
                {roundedValue} {token.symbol}
              </Text.span>{' '}
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

export default AddSingleAssetRow
