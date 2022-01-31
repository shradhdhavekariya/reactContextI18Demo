import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Box } from 'rimble-ui'
import OnboardingHeader from 'src/components/Onboarding/OnboardingHeader'
import Content from 'src/components/common/Content'
import { useTranslation } from 'react-i18next'
import VerifyEmailModal from '../VerifyEmail/VerifyEmailModal'

const PassportSetup = () => {
  const { t } = useTranslation(['onboarding'])
  const [modalOpen, setModalOpen] = useState(true)
  const history = useHistory()
  return (
    <>
      <Box
        width="100vw"
        minHeight="100vh"
        bg="background"
        display="flex"
        flexDirection="column"
      >
        <OnboardingHeader
          header={t('overview.header')}
          button={t('overview.skipForNow')}
        />

        <Content bg="background">
          <Box />
        </Content>
      </Box>
      <VerifyEmailModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
        }}
        onNext={() => history.push('/passport')}
      />
    </>
  )
}

export default PassportSetup
