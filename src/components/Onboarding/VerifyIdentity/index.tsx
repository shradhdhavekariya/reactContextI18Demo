import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Heading, Box } from 'rimble-ui'
import match from 'conditional-expression'
import Content from 'src/components/common/Content'
import VerifyIdentityFAQ from 'src/components/Onboarding/VerifyIdentity/VerifyIdentityFAQ'
import OnboardingHeader from 'src/components/Onboarding/OnboardingHeader'
import { connect } from 'src/state/AppContext'
import { AppState } from 'src/shared/types/state'
import { FlashMessageVariant } from 'src/components/common/Feedback'
import { KycStatus } from 'src/shared/enums'
import KycFeedback from './KycFeedback'
import YesKycCard from './YesKycCard'
import YotiKycCard from './YotiKycCard'
import YotiDocScanCard from './YotiDocScanCard'

interface VerifyIdentityProps extends Record<string, unknown> {
  onNext: () => void
  onClose: () => void
  isVouchersUserOnboarding: boolean
}

interface VerifyIdentityStateProps extends Record<string, unknown> {
  status: KycStatus
  docScanOutcomeReason: string
}

const VerifyIdentity = ({
  status,
  docScanOutcomeReason,
  onNext,
  onClose,
  isVouchersUserOnboarding,
}: VerifyIdentityStateProps & VerifyIdentityProps) => {
  const { t } = useTranslation(['onboarding'])
  const [currentContent, setCurrentContent] = useState(status)

  useEffect(() => {
    if (status === KycStatus.approved) {
      onNext()
    }
  }, [onNext, status])

  useEffect(() => {
    setCurrentContent(status)
  }, [status])

  const restart = () => setCurrentContent(KycStatus.notStarted)

  return (
    <Flex
      width="100vw"
      minHeight="100vh"
      bg="background"
      flexDirection="column"
    >
      <OnboardingHeader
        header={t('verifyIdentity.header')}
        subheader={t('verifyIdentity.subheader')}
        button={t('verifyIdentity.headerButton')}
      />
      <Content centerH bg="background">
        <Box maxWidth="788px">
          {match(currentContent)
            .equals(KycStatus.pending)
            .then(
              <KycFeedback
                onClose={onClose}
                onSubmit={onClose}
                variant={FlashMessageVariant.warning}
              />,
            )
            .equals(KycStatus.rejected)
            .then(
              <KycFeedback
                onClose={onClose}
                onSubmit={restart}
                reason={docScanOutcomeReason}
                variant={FlashMessageVariant.danger}
              />,
            )
            .equals(KycStatus.failed)
            .then(
              <KycFeedback
                onClose={onClose}
                onSubmit={restart}
                variant={FlashMessageVariant.danger}
              />,
            )
            .else(
              <>
                <Heading as="h2" fontSize={3} fontWeight={5}>
                  {t('verifyIdentity.title')}
                </Heading>
                <Flex
                  justifyContent="space-around"
                  flexDirection={['column', 'row']}
                  style={{ gap: '16px' }}
                >
                  <YotiDocScanCard />
                  <YotiKycCard />
                  {/* {When Vouchers app users onboarding to redeem their crypto, only Yoti should be available for them as KYC provider.} */}
                  {!isVouchersUserOnboarding && <YesKycCard />}
                </Flex>
                <VerifyIdentityFAQ />
              </>,
            )}
        </Box>
      </Content>
    </Flex>
  )
}

const mapStateToProps = ({
  user: { kycStatus, docScanOutcomeReason },
}: AppState): VerifyIdentityStateProps => ({
  status: kycStatus,
  docScanOutcomeReason,
})

export default connect<VerifyIdentityProps, VerifyIdentityStateProps>(
  mapStateToProps,
)(VerifyIdentity)
