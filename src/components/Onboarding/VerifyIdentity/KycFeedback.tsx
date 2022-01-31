import { useTranslation } from 'react-i18next'
import { Link, Text, Box, Button } from 'rimble-ui'
import Feedback, { FlashMessageVariant } from 'src/components/common/Feedback'

export enum KycFeedbackVariant {
  success = 'success',
  pending = 'warning',
  rejected = 'danger',
}

interface KycFeedbackModalProps {
  onClose: () => void
  onSubmit: () => void
  onSendEmailAgain?: () => void
  variant: FlashMessageVariant
  email?: string
  reason?: string
}

const KycFeedback = ({
  onClose,
  onSubmit,
  variant,
  email,
  reason,
  onSendEmailAgain,
}: KycFeedbackModalProps) => {
  const { t } = useTranslation(['onboarding'])

  return (
    <Feedback
      title={t(`kyc.feedback.${variant}.heading`)}
      flashMessage={t(`kyc.feedback.${variant}.message`)}
      flashMessageVariant={variant}
      body={
        <>
          <Text.p>
            {t(`kyc.feedback.${variant}.description`)}
            {reason &&
              `${t(`kyc.feedback.reasonDesc`)}${t(
                `kyc.feedback.reason.${reason}`,
              )}`}
          </Text.p>
          <Text.p>{t(`kyc.feedback.${variant}.discriptionContinued`)}</Text.p>
          {variant === FlashMessageVariant.success && (
            <>
              <Text color="grey" fontWeight="600" fontSize="14px">
                Confirmation link was sent to:
              </Text>
              <Text fontWeight="700" fontSize="20px">
                {email}
              </Text>
              <Box mt="12px">
                <Link href={onSendEmailAgain}>
                  Send confirmation email again
                </Link>
              </Box>
            </>
          )}
        </>
      }
      controls={
        <>
          {[FlashMessageVariant.success, FlashMessageVariant.warning].includes(
            variant,
          ) && (
            <Button.Outline
              size="medium"
              px={3}
              width="fit-content"
              color="primary"
              onClick={onClose}
            >
              {t(`kyc.feedback.backToOverview`)}
            </Button.Outline>
          )}

          {variant === FlashMessageVariant.danger && (
            <>
              <Button
                size="medium"
                px={3}
                width="fit-content"
                color="primary"
                onClick={onSubmit}
              >
                {t(`kyc.feedback.startAgain`)}
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
                {t(`kyc.feedback.contact`)}
              </Button.Outline>
            </>
          )}
        </>
      }
    />
  )
}

export default KycFeedback
