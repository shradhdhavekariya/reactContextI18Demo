import { useEffect } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Box, Button, Card, Text } from 'rimble-ui'
import Blockie from 'src/components/common/Blockie'
import Content from 'src/components/common/Content'
import { useAccount } from 'src/shared/web3'
import { AppState } from 'src/shared/types/state'
import { connect } from 'src/state/AppContext'
import OnboardingHeader from 'src/components/Onboarding/OnboardingHeader'
import { useSnackbar } from 'src/components/common/Snackbar'
import { AlertVariant } from 'src/components/common/Snackbar/types'
import { hasCompletedVerification } from 'src/utils'
import { VerificationStatus } from 'src/shared/enums'
import VerifyAddressButton from '../../common/Buttons/VerifyAddressButton'

const Address = styled(Text.p)`
  word-break: break-all;
`

interface VerifyAddressProps {
  onClose: () => void
  onNext: () => void
}

interface VerifyAddressStateProps {
  verificationStatus: VerificationStatus
}

const VerifyAddress = ({
  verificationStatus,
  onClose,
  onNext,
}: VerifyAddressProps & VerifyAddressStateProps) => {
  const { t } = useTranslation(['onboarding'])
  const account = useAccount()
  const { addAlert } = useSnackbar()

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

  return (
    <Box
      width="100vw"
      minHeight="100vh"
      bg="background"
      display="flex"
      flexDirection="column"
    >
      <OnboardingHeader
        header={t('verifyAddress.header')}
        subheader={t('verifyAddress.subheader')}
        button={t('verifyAddress.headerButton')}
      />

      <Content bg="background" center>
        <Card
          p="24px"
          borderRadius={1}
          border={0}
          width="100%"
          maxWidth={['auto', 'auto', '570px']}
          boxShadow={2}
          display="flex"
          flexDirection="column"
        >
          <Blockie address={account} />
          <Text.p fontWeight={4} fontSize={1} color="grey" mt={4} mb={0}>
            {t('verifyAddress.currentAddressLabel')}
          </Text.p>
          <Address fontWeight={5} fontSize={3} lineHeight="28px" mt={1} mb={3}>
            {account}
          </Address>
          <Text.p mt={4}>{t('verifyAddress.description')}</Text.p>
          <VerifyAddressButton onNext={onNext} />
          <Button.Outline
            size="medium"
            px={3}
            mt={3}
            width="fit-content"
            color="primary"
            border="1.5px solid"
            borderColor="primary"
            onClick={onClose}
          >
            {t('verifyAddress.skipButton')}
          </Button.Outline>
        </Card>
      </Content>
    </Box>
  )
}

const mapStateToProps = ({ user: { verificationStatus } }: AppState) => ({
  verificationStatus,
})

export default connect<VerifyAddressProps, ReturnType<typeof mapStateToProps>>(
  mapStateToProps,
)(VerifyAddress)
