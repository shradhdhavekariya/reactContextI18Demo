import { useTranslation } from 'react-i18next'
import match from 'conditional-expression'
import { Box, Heading } from 'rimble-ui'
import { useKycProvider } from 'src/state/hooks'
import { KycProvider } from 'src/shared/enums'
import Tier2Yes from './Tier2Yes'
import Tier2Yoti from './Tier2Yoti'
import Tier2YotiDocScan from './Tier2YotiDocScan'

interface Tier2Props {
  openStep: (step: number) => void
  expanded?: boolean
  step: number
}

const Tier2 = ({ openStep, expanded = false, step }: Tier2Props) => {
  const { t } = useTranslation(['onboarding'])

  const kycProvider = useKycProvider()

  return (
    <Box>
      <Heading
        as="h4"
        fontSize={4}
        lineHeight="title"
        fontWeight={5}
        mt={3}
        mb={2}
        color={expanded ? 'black' : 'grey'}
      >
        {match(step)
          .atLeast(6)
          .then(t('overview.steps.cards.6.title'))
          .else(t('overview.unlimitedTrading.title'))}
      </Heading>
      {expanded &&
        match(kycProvider)
          .equals(KycProvider.yes)
          .then(<Tier2Yes openStep={openStep} step={step} />)
          .equals(KycProvider.yoti)
          .then(<Tier2Yoti />)
          .equals(KycProvider.yotiDocScan)
          .then(<Tier2YotiDocScan />)
          .else(null)}
    </Box>
  )
}

export default Tier2
