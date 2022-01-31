import { useTranslation } from 'react-i18next'
import { Button, Flash, Text, Box, Flex } from 'rimble-ui'
import { Icon } from '@rimble/icons'
import Dialog from 'src/components/common/Dialog'

interface VerifyEmailModalProps {
  isOpen: boolean
  onClose: () => void
  onNext: () => void
}

const VerifyEmailModal = ({
  isOpen,
  onClose,
  onNext,
}: VerifyEmailModalProps) => {
  const { t } = useTranslation(['onboarding'])

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      width={['100%', '440px']}
      title={t('verifyEmail.modal.header')}
    >
      <Flash my={4} variant="success">
        <Flex>
          <Icon name="Check" />
          <Text.span ml={2} fontWeight={5}>
            {t('verifyEmail.modal.status')}
          </Text.span>
        </Flex>
      </Flash>
      <Text.p fontWeight={5}>{t('verifyEmail.modal.instruction1')}</Text.p>
      <Text.p fontWeight={5}>{t('verifyEmail.modal.instruction2')}</Text.p>
      <Box mt="24px">
        <Button
          size="medium"
          px={3}
          width="fit-content"
          color="primary"
          onClick={onNext}
        >
          {t('verifyEmail.modal.nextButton')}
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
          {t('verifyEmail.modal.backButton')}
        </Button.Outline>
      </Box>
    </Dialog>
  )
}

export default VerifyEmailModal
