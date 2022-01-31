import { SyntheticEvent } from 'react'
import { Box, Button, Text } from 'rimble-ui'
import { useTranslation } from 'react-i18next'
import Dialog from 'src/components/common/Dialog'

interface ConfirmDisableTokenModalProps {
  isOpen: boolean
  name: string
  closeModal: () => void
  disableAction: (event: SyntheticEvent<Element, Event>) => Promise<void>
}

const ConfirmDisableTokenModal = ({
  isOpen,
  name,
  closeModal,
  disableAction,
}: ConfirmDisableTokenModalProps) => {
  const { t } = useTranslation('wallet')
  return (
    <Dialog
      isOpen={isOpen}
      onClose={closeModal}
      title={t('assetTokens.confirmDisable', { token: name })}
      maxWidth="460px"
    >
      <Text color="grey" fontWeight={3}>
        {t('assetTokens.disableWarning')}
      </Text>
      <Box mt="24px">
        <Button.Outline mr={3} onClick={closeModal}>
          Back
        </Button.Outline>
        <Button onClick={disableAction}>Confirm</Button>
      </Box>
    </Dialog>
  )
}

export default ConfirmDisableTokenModal
