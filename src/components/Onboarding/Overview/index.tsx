import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box } from 'rimble-ui'
import OnboardingHeader from 'src/components/Onboarding/OnboardingHeader'
import Content from 'src/components/common/Content'
import Divider from 'src/components/common/Divider'
import Tier1 from './Tier1'
import Tier2 from './Tier2'

interface OverviewCardsProps {
  step: number
  openStep: (step: number) => void
  onNext: () => void
}

const Overview = ({ step, openStep, onNext }: OverviewCardsProps) => {
  const { t } = useTranslation(['onboarding'])

  const [tier1Expanded, setTier1Expanded] = useState(step < 5)
  const [tier2Expanded, setTier2Expanded] = useState(step > 4)

  useEffect(() => {
    setTier1Expanded(step < 5)
    setTier2Expanded(step > 4)
  }, [step])

  const expandFirstPart = () => setTier1Expanded(true)

  return (
    <Box
      width="100vw"
      minHeight="100vh"
      bg="background"
      display="flex"
      flexDirection="column"
    >
      <OnboardingHeader
        header={t('overview.header')}
        button={t('overview.headerButton')}
      />
      <Content bg="background">
        <Tier1
          step={step}
          expanded={tier1Expanded}
          onExpandClick={expandFirstPart}
          openStep={openStep}
          onNext={onNext}
        />
        {step > 4 && (
          <>
            <Divider />
            <Tier2 step={step} expanded={tier2Expanded} openStep={openStep} />
          </>
        )}
      </Content>
    </Box>
  )
}

export default Overview
