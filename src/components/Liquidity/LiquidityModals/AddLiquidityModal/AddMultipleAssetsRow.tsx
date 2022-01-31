import { useFormikContext } from 'formik'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Flex, Text, Radio } from 'rimble-ui'
import { ExtendedPoolToken } from 'src/shared/types/tokens'
import LiquidityInput from '../../LiquidityInput'
import { AddLiquidityValues } from './types'

interface AddMultipleAssetsRowProps {
  checked?: boolean
  value?: number
  onSelect: (token: ExtendedPoolToken | 'all') => void
  onChange?: (value: number) => void
  disabled?: boolean
}

const AddMultipleAssetsRow = ({
  checked = false,
  value,
  onSelect: onClick,
  onChange,
  disabled = false,
}: AddMultipleAssetsRowProps) => {
  const { t } = useTranslation('liquidityModals')
  const { resetForm } = useFormikContext<AddLiquidityValues>()

  const handleOnSelect = useCallback(() => {
    resetForm()
    onClick('all')
  }, [onClick, resetForm])

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
        <Radio
          onChange={handleOnSelect}
          checked={checked}
          disabled={disabled}
        />
        <Flex flexDirection="column">
          <Box>
            <Text.span fontWeight={5} lineHeight="24px">
              {t('add.addMultipleTitle')}
            </Text.span>
          </Box>
          <Text.span color="grey" fontSize={1} lineHeight="20px">
            {t('add.addMultipleSubtitle')}
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
          disabled={disabled}
        />
      )}
    </Flex>
  )
}

export default AddMultipleAssetsRow
