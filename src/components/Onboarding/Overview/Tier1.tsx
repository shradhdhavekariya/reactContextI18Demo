import React, { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Flex, Heading, Icon, Text, Input } from 'rimble-ui'
import { Ellipsis } from 'react-spinners-css'
import match from 'conditional-expression'
import StyledButton from 'src/components/StyledButton'
import { useSnackbar } from 'src/components/common/Snackbar'
import { useAccount } from 'src/shared/web3'
import { AlertVariant } from 'src/components/common/Snackbar/types'
import { AppState, DispatchWithThunk } from 'src/shared/types/state'
import { connect } from 'src/state/AppContext'
import VerifyAddressButton from 'src/components/common/Buttons/VerifyAddressButton'
import { KycStatus, VerificationStatus, KycProvider } from 'src/shared/enums'
import { Color } from 'src/theme'
import { hasCompletedVerification, truncateStringInTheMiddle } from 'src/utils'
import useBreakpoints from 'src/shared/hooks/useBreakPoints'
import ResendEmailButton from 'src/components/common/Buttons/ResendEmailButton'
import api from 'src/services/api'
import { docScanSessionWaitingUpdated } from 'src/state/actions/users'
import useEffectCompare from 'src/shared/hooks/useEffectCompare'
import OverviewCard from './OverviewCard'
import StepDuration from './StepDuration'
import USAlert from './USAlert'
import OverviewCardsContainer from './OverviewCardsContainer'
import Completed from './Completed'
import ConnectIdentityPrivacyModal from './ConnectIdentityPrivacyModal'

interface Tier1Props {
  step: number
  openStep: (step: number) => void
  expanded?: boolean
  onExpandClick: () => void
  onNext: () => void
}

interface Tier1StateProps extends Record<string, unknown> {
  kycStatus: KycStatus
  kycProvider: KycProvider
  initiated: boolean
  docScanSessionWaiting?: number
  setDocScanSessionWaiting?: (status: number) => void
}

interface VerifyAddressStateProps {
  verificationStatus: VerificationStatus
}

const Tier1 = ({
  initiated,
  step,
  docScanSessionWaiting,
  setDocScanSessionWaiting = () => {},
  openStep,
  kycStatus,
  kycProvider,
  expanded = true,
  onExpandClick,
  verificationStatus,
  onNext,
}: Tier1Props & Tier1StateProps & VerifyAddressStateProps) => {
  const { t } = useTranslation(['onboarding'])
  const account = useAccount()
  const { isSm, isXs } = useBreakpoints()
  const { addAlert, addError } = useSnackbar()
  const [
    openConnectIdentityPrivacyModal,
    setOpenConnectIdentityPrivacyModal,
  ] = useState(false)
  const [mobileAlertShown, setMobileAlertShown] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  const inputChangeHandler = (e: React.MouseEvent<HTMLInputElement>) => {
    setUserEmail(e.currentTarget.value)
  }

  const verifyEmail = useCallback(async () => {
    if (userEmail) {
      try {
        await api.verifyDocscanEmail(userEmail)
        setEmailSent(true)
      } catch (e) {
        addError(e as Error)
      }
    }
  }, [userEmail, addError])

  useEffect(() => {
    if (
      hasCompletedVerification(VerificationStatus.addressVerified)(
        verificationStatus,
      )
    ) {
      onNext()
      addAlert(t('verifyAddress.success'), { variant: AlertVariant.success })
    }
  }, [addAlert, onNext, t, verificationStatus])

  useEffect(() => {
    if ((isSm || isXs) && step === 3 && !mobileAlertShown) {
      setMobileAlertShown(true)
      addAlert('Please complete this step on a desktop browser')
    }
  }, [addAlert, isSm, isXs, mobileAlertShown, step])

  const getDescription = (stepNum: number) => {
    if (stepNum < step) return ''

    if (stepNum === 2 && step === stepNum) {
      return t('overview.steps.cards.2.active.description')
    }

    if (stepNum === 3) {
      if (kycStatus === KycStatus.pending)
        return t('overview.steps.cards.3.pendingDescription')

      if (kycStatus === KycStatus.failed)
        return t('overview.steps.cards.3.failedDescription')
    }
    return t(`overview.steps.cards.${stepNum}.description`).concat(
      isSm || isXs ? t('overview.steps.cards.3.description-mobile') : '',
    )
  }

  useEffectCompare(() => {
    if (docScanSessionWaiting === 1 && kycStatus === KycStatus.rejected) {
      setDocScanSessionWaiting(0)
      openStep(3)
    }
  }, [docScanSessionWaiting])

  return (
    <Box>
      <Heading
        as="h4"
        fontSize={4}
        lineHeight="title"
        fontWeight={5}
        m="0 0 8px 0"
        color={expanded ? 'black' : 'grey'}
      >
        {t('overview.steps.header')}
      </Heading>
      <Text.p color="text-light" m="0">
        {step < 5
          ? t('overview.steps.subheader')
          : t('overview.steps.completedSubheader')}
      </Text.p>

      <USAlert />

      <OverviewCardsContainer expanded={expanded} onExpand={onExpandClick}>
        <OverviewCard
          title={
            initiated && step > 1
              ? t('overview.steps.cards.1.completed.title')
              : t('overview.steps.cards.1.title')
          }
          description={getDescription(1)}
          stepNumber="1"
          stepCompleted={initiated && step > 1}
          isActive={step === 1}
        >
          {initiated ? (
            match(step)
              .equals(1)
              .then(
                <StyledButton mt="24px" onClick={() => openStep(1)}>
                  {t('overview.steps.cards.1.button')}
                </StyledButton>,
              )
              .else(<Completed />)
          ) : (
            <StyledButton mt="24px" disabled={!initiated}>
              {t('overview.steps.cards.1.button')}
            </StyledButton>
          )}
        </OverviewCard>
        <OverviewCard
          title={
            initiated && step > 2
              ? t('overview.steps.cards.2.completed.title')
              : t('overview.steps.cards.2.title')
          }
          description={getDescription(2)}
          stepNumber="2"
          stepCompleted={step > 2}
          isActive={step === 2}
        >
          {step > 1 && account && (
            <>
              <Text fontSize="15px" color={Color.grey}>
                {t('overview.steps.cards.2.completed.signedAddressTitle')}
              </Text>
              <Text color={Color.nearBlack}>
                {truncateStringInTheMiddle(account)}
              </Text>
            </>
          )}
          {initiated ? (
            match(step)
              .lessThan(2)
              .then(
                <StepDuration legend={t('overview.steps.cards.2.duration')} />,
              )
              .equals(2)
              .then(
                <VerifyAddressButton
                  render={(verify, loading) => (
                    <StyledButton mt="24px" onClick={verify} disabled={loading}>
                      {t('overview.steps.cards.2.button')}
                    </StyledButton>
                  )}
                />,
              )
              .else(<Completed />)
          ) : (
            <StepDuration legend={t('overview.steps.cards.2.duration')} />
          )}
        </OverviewCard>
        <OverviewCard
          title={
            initiated && step > 3
              ? t('overview.steps.cards.3.completed.title')
              : t('overview.steps.cards.3.title')
          }
          description={getDescription(3)}
          stepNumber="3"
          stepCompleted={step > 3}
          isActive={step === 3}
        >
          {match(step)
            .lessThan(3)
            .then(
              <StepDuration legend={t('overview.steps.cards.3.duration')} />,
            )
            .equals(3)
            .then(
              docScanSessionWaiting === 2 ? (
                <Flex
                  mt="24px"
                  mb="5px"
                  justifyContent="space-between"
                  alignItems="center"
                  color="primary"
                >
                  <Flex>
                    <Text.span>
                      {t('overview.steps.cards.3.inProgress')}
                    </Text.span>
                    <Ellipsis color={Color.primary} size={64} />
                  </Flex>
                </Flex>
              ) : (
                match(kycStatus)
                  .equals(KycStatus.pending)
                  .then(
                    <Flex
                      mt="24px"
                      mb="5px"
                      justifyContent="space-between"
                      alignItems="center"
                      color="primary"
                    >
                      <Flex alignItems="center">
                        <Icon name="AccessTime" mr="10px" size="28px" />
                        <Text.span>
                          {t('overview.steps.cards.3.pending')}
                        </Text.span>
                      </Flex>
                    </Flex>,
                  )
                  .equals(KycStatus.inProgress)
                  .then(
                    <Flex
                      mt="24px"
                      mb="5px"
                      justifyContent="space-between"
                      alignItems="center"
                      color="primary"
                    >
                      <Flex>
                        <Icon name="InfoOutline" mr={1} />
                        <Text.span>
                          {t('overview.steps.cards.3.inProgress')}
                        </Text.span>
                      </Flex>
                    </Flex>,
                  )
                  .equals(KycStatus.failed)
                  .then(null)
                  .equals(KycStatus.rejected)
                  .then(
                    <Flex
                      mt="24px"
                      justifyContent="space-between"
                      alignItems="center"
                      color="danger"
                    >
                      <Flex>
                        <Icon name="HighlightOff" mr={1} />
                        <Text.span>
                          {t('overview.steps.cards.3.failed')}
                        </Text.span>
                      </Flex>
                      <Button.Text onClick={() => openStep(3)}>
                        {t('overview.steps.cards.3.details')}
                      </Button.Text>
                    </Flex>,
                  )
                  .else(
                    <StyledButton
                      mt="24px"
                      onClick={() => setOpenConnectIdentityPrivacyModal(true)}
                      disabled={isSm || isXs}
                    >
                      {t('overview.steps.cards.3.button')}
                    </StyledButton>,
                  )
              ),
            )
            .else(<Completed />)}
        </OverviewCard>
        <OverviewCard
          title={
            initiated && step > 4
              ? t('overview.steps.cards.4.completed.title')
              : t('overview.steps.cards.4.title')
          }
          description={getDescription(4)}
          stepNumber="4"
          stepCompleted={step > 4}
          isActive={step === 4}
        >
          {match(step)
            .lessThan(4)
            .then(
              <StepDuration legend={t('overview.steps.cards.4.duration')} />,
            )
            .equals(4)
            .then(
              match(kycProvider)
                .equals('yoti_docscan')
                .then(
                  emailSent ? (
                    <Flex mt="24px" flexDirection="column">
                      <Text.p m="0" fontWeight="4">
                        {t('overview.steps.cards.4.sentDescription')}
                      </Text.p>
                      <Text.p mt="0">{userEmail}</Text.p>
                      <Flex justifyContent="space-around" alignItems="center">
                        <Button.Text icon="Refresh" onClick={verifyEmail}>
                          {t('overview.steps.cards.4.sendAgain')}
                        </Button.Text>
                        <Button.Text onClick={() => setEmailSent(false)}>
                          {t('overview.steps.cards.4.retry')}
                        </Button.Text>
                      </Flex>
                    </Flex>
                  ) : (
                    <Flex mt="24px" flexDirection="column">
                      <Input
                        width="100%"
                        bg="white"
                        height="36px"
                        placeholder="Your email address"
                        onChange={inputChangeHandler}
                        defaultValue={userEmail}
                      />
                      <StyledButton
                        mt="24px"
                        width="fit-content"
                        onClick={verifyEmail}
                        disabled={isSm || isXs}
                      >
                        {t('overview.steps.cards.4.submitButton')}
                      </StyledButton>
                    </Flex>
                  ),
                )
                .else(
                  <ResendEmailButton>
                    {t('overview.steps.cards.4.button')}
                  </ResendEmailButton>,
                ),
            )
            .else(<Completed />)}
        </OverviewCard>
      </OverviewCardsContainer>

      {openConnectIdentityPrivacyModal && (
        <ConnectIdentityPrivacyModal
          onClose={() => setOpenConnectIdentityPrivacyModal(false)}
          onNext={() => openStep(3)}
        />
      )}
    </Box>
  )
}

const mapDispatchToProps = (dispatch: DispatchWithThunk<AppState>) => ({
  setDocScanSessionWaiting: (status: number) =>
    dispatch(docScanSessionWaitingUpdated(status)),
})

const mapStateToProps = ({
  initiated,
  user: { kycStatus, kycProvider, docScanSessionWaiting },
}: AppState): Tier1StateProps => ({
  kycStatus,
  kycProvider,
  docScanSessionWaiting,
  initiated,
})

export default connect<Tier1Props, Tier1StateProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Tier1)
