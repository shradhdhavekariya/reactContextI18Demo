import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Text } from 'rimble-ui'
import Content from 'src/components/common/Content'
import OnboardingHeader from 'src/components/Onboarding/OnboardingHeader'
import Feedback, { FlashMessageVariant } from 'src/components/common/Feedback'
import {
  AppState,
  DispatchWithThunk,
  UserProfile,
} from 'src/shared/types/state'
import { connect } from 'src/state/AppContext'
import { resendConfirmationEmail } from 'src/state/actions/users'
import { AlertVariant } from 'src/components/common/Snackbar/types'
import { useSnackbar } from 'src/components/common/Snackbar'

interface VerifyEmailProps {
  onClose: () => void
}

interface VerifyEmailStateProps extends Record<string, unknown> {
  user: UserProfile
}
interface VerifyEmailActions extends Record<string, unknown> {
  resend: () => void
}

const VerifyEmail = ({
  onClose,
  user,
  resend,
}: VerifyEmailProps & VerifyEmailStateProps & VerifyEmailActions) => {
  const { t } = useTranslation(['onboarding'])
  const { addAlert } = useSnackbar()
  const [canResend, setCanResend] = useState(true)

  const handleResendButton = () => {
    if (canResend) {
      setCanResend(false)
      resend()
      setTimeout(() => {
        setCanResend(true)
      }, 60000)
      addAlert(t('email.resent'), { variant: AlertVariant.success })
    } else {
      addAlert(t('email.pleaseWait'), { variant: AlertVariant.warning })
    }
  }

  return (
    <Box
      width="100vw"
      minHeight="100vh"
      bg="background"
      display="flex"
      flexDirection="column"
    >
      <OnboardingHeader
        header={t('verifyEmail.header')}
        subheader={t('verifyEmail.subheader')}
        button={t('verifyEmail.headerButton')}
      />
      <Content center bg="background">
        <Feedback
          title={t('kyc.feedback.success.heading')}
          flashMessage={t('kyc.feedback.success.message')}
          flashMessageVariant={FlashMessageVariant.success}
          body={
            <>
              <Text.p fontWeight={4} fontSize={1} color="grey" m={0}>
                {t('verifyEmail.currentEmailLabel')}
              </Text.p>
              <Text.p
                fontWeight={5}
                fontSize={3}
                lineHeight="28px"
                mt={1}
                mb={3}
              >
                {user.email}
              </Text.p>
              <Button.Text
                as="a"
                title={t('verifyEmail.sendEmailAgainLink')}
                color="primary"
                hoverColor="primary-dark"
                fontWeight={2}
                lineHeight="copy"
                height="auto"
                width="fit-content"
                fontSize="inherit"
                p={0}
                onClick={handleResendButton}
              >
                {t('verifyEmail.sendEmailAgainLink')}
              </Button.Text>
              <Text.p mt={4} mb={0}>
                {t('verifyEmail.description')}
              </Text.p>
            </>
          }
          controls={
            <Button.Outline
              size="medium"
              px={3}
              mt={4}
              width="fit-content"
              color="primary"
              border="1.5px solid"
              borderColor="primary"
              onClick={onClose}
            >
              {t('verifyEmail.backButton')}
            </Button.Outline>
          }
        />
      </Content>
    </Box>
  )
}

const mapStateToProps = ({ user }: AppState) => ({ user })

const mapDispatchToProps = (dispatch: DispatchWithThunk<AppState>) => ({
  resend: () => dispatch(resendConfirmationEmail()),
})

export default connect<
  VerifyEmailProps,
  VerifyEmailStateProps,
  VerifyEmailActions
>(
  mapStateToProps,
  mapDispatchToProps,
)(VerifyEmail)
