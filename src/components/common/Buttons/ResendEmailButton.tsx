import { useTranslation } from 'react-i18next'
import { AppState, DispatchWithThunk } from 'src/shared/types/state'
import { resendConfirmationEmail } from 'src/state/actions/users'
import { connect } from 'src/state/AppContext'
import useAsyncState from 'src/hooks/useAsyncState'
import { useSnackbar } from 'src/components/common/Snackbar'
import { AlertVariant } from 'src/components/common/Snackbar/types'
import SecondaryButton from './SecondaryButton'

interface VerifyEmailActions extends Record<string, unknown> {
  resendEmail: () => void
}

const ResendEmailButton = ({ resendEmail, ...rest }: VerifyEmailActions) => {
  const { t } = useTranslation('onboarding')
  const { addAlert } = useSnackbar()
  const [canResend, setCanResend] = useAsyncState(true)

  const handleResendButton = () => {
    if (canResend) {
      setCanResend(false)
      resendEmail()

      setTimeout(() => {
        setCanResend(true)
      }, 60000)

      addAlert(t('email.resent'), { variant: AlertVariant.success })
    } else {
      addAlert(t('email.pleaseWait'), { variant: AlertVariant.warning })
    }
  }

  return <SecondaryButton onClick={handleResendButton} {...rest} />
}

const mapDispatchToProps = (dispatch: DispatchWithThunk<AppState>) => ({
  resendEmail: () => dispatch(resendConfirmationEmail()),
})

export default connect<
  Record<string, never>,
  Record<string, never>,
  VerifyEmailActions
>(
  null,
  mapDispatchToProps,
)(ResendEmailButton)
