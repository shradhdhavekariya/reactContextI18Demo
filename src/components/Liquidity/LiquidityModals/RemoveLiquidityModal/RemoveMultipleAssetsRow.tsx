import React from 'react'
import { Box, Flex, Text, Radio } from 'rimble-ui'
import LiquidityInput from 'src/components/Liquidity/LiquidityInput'
import useDeepTranslation from 'src/hooks/useDeepTranslation'
import { MultipleAssetsRowProps } from 'src/shared/types/props'

const RemoveMultipleAssetsRow = ({
  checked = false,
  onSelect: onClick,
  onChange,
  value,
  disabled = false,
}: MultipleAssetsRowProps) => {
  const { t } = useDeepTranslation('liquidityModals', ['remove'])

  return (
    <Flex
      width="100%"
      justifyContent="space-between"
      alignItems="center"
      height="96px"
      px={2}
      borderBottom="1px solid"
      borderColor="light-gray"
      flex="1 0 96px"
    >
      <Flex>
        <Radio onChange={onClick} checked={checked} disabled={disabled} />
        <Flex flexDirection="column">
          <Box>
            <Text.span fontWeight={5} lineHeight="24px">
              {t('removeMultipleTitle')}
            </Text.span>{' '}
          </Box>
          <Text.span color="grey" fontSize={1} lineHeight="20px">
            {t('removeMultipleSubtitle')}
          </Text.span>
        </Flex>
      </Flex>
      {checked && (
        <LiquidityInput
          value={value}
          width="200px"
          onChange={onChange}
          endAdornment="%"
          min={0}
          max={100}
          sliderOptions={{ variant: 'danger' }}
          disabled={disabled}
        />
      )}
    </Flex>
  )
}

export default RemoveMultipleAssetsRow
