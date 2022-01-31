import { useState, useCallback, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import match from 'conditional-expression'
import qs from 'query-string'
import { useSnackbar } from 'src/components/common/Snackbar'

import { AppState, DispatchWithThunk } from 'src/shared/types/state'
import { connect } from 'src/state/AppContext'
import { useAccount, useConnectWallet } from 'src/shared/web3'
import Overview from 'src/components/Onboarding/Overview'
import VerifyIdentity from 'src/components/Onboarding/VerifyIdentity'
import VerifyBank from 'src/components/Onboarding/VerifyBank'
import { VerificationStatus } from 'src/shared/enums'
import CompleteRegistration from 'src/components/Onboarding/CompleteRegistration.tsx'
import { getVerificationStep } from 'src/utils'
import OnboardVouchersUserMessage from 'src/components/Vouchers/OnboardVouchersUserMessage'
import { docScanSessionResults } from 'src/state/actions/users'
import { AlertVariant } from 'src/components/common/Snackbar/types'

interface OnboardingDerivedProps extends Record<string, unknown> {
  currentStep: number
  sessionResults: (sessionID: string) => void
}

const OnBoardingPage = ({
  currentStep,
  sessionResults,
}: OnboardingDerivedProps) => {
  const { t } = useTranslation(['alerts'])
  const account = useAccount()
  const connectWallet = useConnectWallet()
  const { addAlert } = useSnackbar()
  const availableStep = !account ? 1 : currentStep
  const [stepOpen, setStepOpen] = useState<number | null>(null)
  const { search } = useLocation()
  const isVouchersUserOnboarding = search.includes(
    'vouchers_user_redeeming_voucher=true',
  )
  const searchParams = qs.parse(search)
  const status = searchParams.docscan?.toString() || ''
  const sessionID = localStorage.getItem('yotiDocScanSessionID') || ''
  const history = useHistory()

  useEffect(() => {
    switch (status) {
      case 'success':
        if (sessionID) {
          sessionResults(sessionID)
        }
        break
      case 'error':
        addAlert(t('docScan.error'), {
          variant: AlertVariant.error,
          autoDismissible: true,
        })
        break
      default:
        break
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, sessionID])

  useEffect(() => {
    window.onpopstate = () => {
      if (stepOpen) {
        setStepOpen(null)
      }
    }
    return () => {
      window.onpopstate = null
    }
  }, [stepOpen])

  const openStep = useCallback(
    async (step: number) => {
      if (step === 1) {
        if (await connectWallet()) {
          setStepOpen(currentStep)
        }
      } else {
        history.push(history.location)
        setStepOpen(step)
      }
    },
    [connectWallet, currentStep, history],
  )

  const nextStep = useCallback(() => {
    if (stepOpen === 1) {
      setStepOpen(2)
    } else if (availableStep < 5) {
      setStepOpen(availableStep)
    } else {
      setStepOpen(null)
    }
  }, [availableStep, stepOpen])

  const closeStep = useCallback(() => {
    setStepOpen(null)
  }, [])

  return (
    <>
      <OnboardVouchersUserMessage
        visible={isVouchersUserOnboarding}
        availableStep={availableStep}
      />
      {match(stepOpen)
        .equals(3)
        .then(
          <VerifyIdentity
            isVouchersUserOnboarding={isVouchersUserOnboarding}
            onNext={nextStep}
            onClose={closeStep}
          />,
        )
        .equals(5)
        .then(<VerifyBank onClose={closeStep} />)
        .equals(6)
        .then(<CompleteRegistration onNext={nextStep} />)
        .else(
          <Overview
            step={availableStep}
            openStep={openStep}
            onNext={nextStep}
          />,
        )}
    </>
  )
}
const mapDispatchToProps = (dispatch: DispatchWithThunk<AppState>) => ({
  sessionResults: (sessionId: string) =>
    dispatch(docScanSessionResults(sessionId)),
})

const mapStateToProps = ({ user }: AppState) => {
  const { verificationStatus } = user || {
    verificationStatus: VerificationStatus.notVerified,
  }

  return {
    currentStep: getVerificationStep(verificationStatus),
  }
}

export default connect<OnboardingDerivedProps>(
  mapStateToProps,
  mapDispatchToProps,
)(OnBoardingPage)
