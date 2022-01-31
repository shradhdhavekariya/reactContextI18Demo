import { useCallback, useContext, useMemo, useState } from 'react'
import { Box, Button, Flex, Heading, Tooltip } from 'rimble-ui'
import { AdvancedSettingsProps } from 'src/shared/types/props'
import ToggleButtonGroup from 'src/components/common/ToggleButtonGroup'
import {
  MAX_SAFE_SLIPPAGE,
  transactionToleranceOptions,
} from 'src/shared/consts'
import { useTranslation } from 'react-i18next'
import Dialog from 'src/components/common/Dialog'
import { SwapTxSettings } from 'src/shared/types'
import { useSnackbar } from 'src/components/common/Snackbar'
import { AlertVariant } from 'src/components/common/Snackbar/types'
import { saveSettingsPerSession } from 'src/shared/utils'
import { SwapContext } from '../SwapContext'
import AutoPaySwitch from './AutoPaySwitch'

const AdvancedSettings = ({ isOpen, onClose }: AdvancedSettingsProps) => {
  const { t } = useTranslation('swap')
  const { addAlert } = useSnackbar()
  const { settings, setSwapSettings } = useContext(SwapContext)
  const [localSettings, setLocalSettings] = useState<SwapTxSettings>(settings)

  const isValid = useMemo(() => localSettings.tolerance <= MAX_SAFE_SLIPPAGE, [
    localSettings.tolerance,
  ])

  const handleToleranceChange = useCallback(
    (tolerance: number) => setLocalSettings((prev) => ({ ...prev, tolerance })),
    [],
  )

  const handleAutoPaySmtChange = useCallback(
    () =>
      setLocalSettings((prev) => ({
        ...prev,
        autoPaySmtDiscount: !prev.autoPaySmtDiscount,
      })),
    [],
  )

  const handleSaveSettings = useCallback(() => {
    setSwapSettings(localSettings)
    saveSettingsPerSession(localSettings)
    addAlert(t('advancedSettings.savedTextToastMessage'), {
      variant: AlertVariant.success,
    })
    onClose()
  }, [t, addAlert, onClose, localSettings, setSwapSettings])

  const resetLocalSettings = useCallback(() => setLocalSettings(settings), [
    settings,
  ])

  const closeModal = useCallback(() => {
    resetLocalSettings()
    onClose()
  }, [onClose, resetLocalSettings])

  return (
    <Dialog
      isOpen={isOpen}
      width={['100%', 'auto']}
      minWidth={[0, 0, '428px']}
      onClose={closeModal}
      p="24px"
      title={t('advancedSettings.header')}
      titleProps={{
        fontSize: 3,
      }}
    >
      <Flex alignItems="center" mt={3}>
        <Heading
          as="h4"
          fontSize={1}
          lineHeight="copy"
          fontWeight={5}
          m={0}
          color="black"
        >
          {t('advancedSettings.tolerance')}
        </Heading>
        <Tooltip
          placement="top"
          message={t('advancedSettings.toleranceTooltip')}
          variant="light"
        >
          <Button variant="plain" height="16px" icononly icon="Help" ml={2} />
        </Tooltip>
      </Flex>

      <Box>
        <ToggleButtonGroup
          selectedValue={localSettings.tolerance}
          options={transactionToleranceOptions}
          onSelect={handleToleranceChange}
          validator={(value) => value >= 0 && value < 100}
        />
      </Box>

      <Flex alignItems="center" mt="24px">
        <Heading
          as="h4"
          fontSize={1}
          lineHeight="copy"
          fontWeight={5}
          m={0}
          color="black"
        >
          {t('advancedSettings.discountAutoPay')}
        </Heading>
        <Tooltip
          placement="top"
          message={t('advancedSettings.discountAutoPayTooltip')}
          variant="light"
        >
          <Button variant="plain" height="16px" icononly icon="Help" ml={2} />
        </Tooltip>
      </Flex>

      <Box>
        <AutoPaySwitch
          checked={localSettings.autoPaySmtDiscount}
          onChange={handleAutoPaySmtChange}
        />
      </Box>

      <Box mt="24px">
        <Button disabled={!isValid} width="100%" onClick={handleSaveSettings}>
          {t('advancedSettings.saveBtn')}
        </Button>
      </Box>
    </Dialog>
  )
}

export default AdvancedSettings
