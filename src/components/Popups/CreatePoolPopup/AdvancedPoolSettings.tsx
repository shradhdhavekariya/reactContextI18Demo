import { useCallback } from 'react'
import { useField } from 'formik'
import { Box, Button, Card, Flex, Heading, Tooltip } from 'rimble-ui'
import { useTranslation } from 'react-i18next'
import ToggleButtonGroup from 'src/components/common/ToggleButtonGroup'
import { ToggleButtonOption } from 'src/shared/types'
import CreatePoolButton from './CreatePoolButton'

const swapFeeOptions: ToggleButtonOption[] = [
  {
    value: 0.1,
    label: '0.1%',
  },
  {
    value: 0.15,
    label: '0.15%',
  },
  {
    value: 0.2,
    label: '0.2%',
  },
  {
    value: null,
    custom: true,
  },
]

const AdvancedPoolSettings = () => {
  const { t } = useTranslation('pools')

  const [field, meta, helper] = useField({ name: 'swapFee' })

  const handleSwapFeeChange = useCallback(
    (swapFee: number) => {
      helper.setValue(swapFee / 100)
    },
    [helper],
  )

  return (
    <Card
      mt={3}
      p="20px"
      borderRadius={1}
      boxShadow={4}
      border="0"
      display="flex"
      flexDirection="column"
      width="100%"
      height="fit-content"
    >
      <Heading
        fontSize={3}
        lineHeight="20px"
        fontWeight={5}
        mb={2}
        mt={0}
        color="grey"
      >
        {t('createPool.advanced.title')}
      </Heading>
      <Flex alignItems="center" mt={3}>
        <Heading
          as="h4"
          fontSize={2}
          lineHeight="copy"
          fontWeight={5}
          m={0}
          color="black"
        >
          {t('createPool.advanced.swapFee')}
        </Heading>
        <Tooltip placement="top" message={t('createPool.advanced.tooltip')}>
          <Button variant="plain" height="16px" icononly icon="Help" ml={2} />
        </Tooltip>
      </Flex>
      <Box>
        <ToggleButtonGroup
          selectedValue={field.value * 100}
          options={swapFeeOptions}
          onSelect={handleSwapFeeChange}
          error={meta.error}
        />
      </Box>
      <CreatePoolButton />
    </Card>
  )
}

export default AdvancedPoolSettings
