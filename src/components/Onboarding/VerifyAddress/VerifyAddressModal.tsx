import { useTranslation } from 'react-i18next'
import { Button, Flash, Text, Box, Flex } from 'rimble-ui'
import { Icon } from '@rimble/icons'
import Dialog from 'src/components/common/Dialog'

interface VerifyAddressModalProps {
  isOpen: boolean
  onClose: () => void
  onNext: () => void
}

const VerifyAddressModal = ({
  isOpen,
  onClose,
  onNext,
}: VerifyAddressModalProps) => {
  const { t } = useTranslation(['onboarding'])

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={t('verifyAddress.modal.header')}
      width={['100%', '440px']}
    >
      <Flash my={4} variant="success">
        <Flex>
          <Icon name="Check" />
          <Text.span ml={2} fontWeight={5}>
            {t('verifyAddress.modal.status')}
          </Text.span>
        </Flex>
      </Flash>
      <Text.p>
        <Text.span fontWeight={5}>Tip:</Text.span>{' '}
        {t('verifyAddress.modal.tip')}
      </Text.p>
      <Box mt="24px">
        <Button
          size="medium"
          px={3}
          width="fit-content"
          color="primary"
          onClick={onNext}
        >
          {t('verifyAddress.modal.nextButton')}
        </Button>
        <Button.Outline
          size="medium"
          px={3}
          ml={3}
          width="fit-content"
          color="primary"
          border="1.5px solid"
          borderColor="primary"
          onClick={onClose}
        >
          {t('verifyAddress.modal.backButton')}
        </Button.Outline>
      </Box>
    </Dialog>
  )
}

export default VerifyAddressModal
