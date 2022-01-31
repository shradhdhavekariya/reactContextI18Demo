import { useTranslation } from 'react-i18next'
import { Flex, Text, Box } from 'rimble-ui'
import { Done, Close } from '@rimble/icons'
import match from 'conditional-expression'
import { parseISO, format } from 'date-fns'
import useRequest from 'src/hooks/useRequest'
import SecondaryButton from 'src/components/common/Buttons/SecondaryButton'
import StyledButton from 'src/components/StyledButton'
import api from 'src/services/api'
import { download } from 'src/shared/utils/dom'
import { Tier } from 'src/shared/enums'
import { useTier } from 'src/state/hooks'
import LinkButton from 'src/components/common/Buttons/LinkButton'
import { Color } from 'src/theme'
import Completed from './Completed'
import OverviewCardsContainer from './OverviewCardsContainer'
import Tier2Card from './Tier2Card'
import StepDuration from './StepDuration'
import Pending from './Pending'

interface Tier2YesProps {
  openStep: (step: number) => void
  step: number
}

const Tier2Yes = ({ openStep, step }: Tier2YesProps) => {
  const { t } = useTranslation(['onboarding'])
  const tier = useTier()

  const { data, loading: paymentInfoLoading } = useRequest(api.getPaymentInfo)

  const fundsSent = data?.attributes?.status === 'sent'

  const handleDownloadSignedPdfClick = async () => {
    const info = await api.getSignedDocInfo()

    download(t('signToS.pdfName'), info.attributes.download_url)
  }

  return (
    <>
      <Text.p color="grey" m="0">
        {match(step)
          .atLeast(8)
          .then(
            match(tier)
              .equals(Tier.tier2)
              .then(t('overview.unlimitedTrading.accountApproved'))
              .equals(Tier.tier99)
              .then(t('overview.unlimitedTrading.accountNotApproved'))
              .else(undefined),
          )
          .else(t('overview.unlimitedTrading.content'))}
        {/* <Link
          href="#!"
          title="Learn more"
          color="primary"
          hoverColor="primary-dark"
          fontWeight={2}
          fontSize="inherit"
        >
          {t('overview.unlimitedTrading.link')}
        </Link> */}
      </Text.p>
      <OverviewCardsContainer>
        <Tier2Card
          title={match(step)
            .atLeast(6)
            .then(t('overview.steps.cards.5.yes.verified'))
            .else(t('overview.steps.cards.5.yes.title'))}
          description={match(step)
            .atLeast(6)
            .then(undefined)
            .else(
              fundsSent
                ? t('overview.steps.cards.5.yes.fundsSent', {
                    date: format(
                      parseISO(data?.attributes?.sent_at),
                      'hh:mm aa MM/dd/yyyy',
                    ),
                  })
                : t('overview.steps.cards.5.yes.description'),
            )}
          icon={match(step)
            .atLeast(6)
            .then(<Done color="white" />)
            .else(undefined)}
          isActive={step === 5}
          step={step}
          stepCompleted={step > 5}
        >
          {match(step)
            .atLeast(6)
            .then(<Completed />)
            .else(
              <Flex alignItems="center" mt="24px">
                {fundsSent && <Pending mr={2} />}
                <StyledButton
                  onClick={() => openStep(5)}
                  style={{ width: `${fundsSent ? 'fit-content' : '100%'}` }}
                  disabled={step === 5 && paymentInfoLoading}
                >
                  {fundsSent
                    ? t('overview.steps.cards.5.yes.viewDetails')
                    : t('overview.steps.cards.5.yes.button')}
                </StyledButton>
              </Flex>,
            )}
        </Tier2Card>
        <Tier2Card
          title={match(step)
            .atLeast(7)
            .then(t('overview.steps.cards.6.completed'))
            .else(t('overview.steps.cards.6.title'))}
          description={match(step)
            .atLeast(7)
            .then(undefined)
            .equals(6)
            .then(t('overview.steps.cards.6.finalizeDescription'))
            .else(t('overview.steps.cards.6.description'))}
          icon={match(step)
            .atLeast(7)
            .then(<Done color="white" />)
            .else(undefined)}
          isActive={step === 6}
          step={step}
          stepCompleted={step > 6}
        >
          {match(step)
            .atLeast(7)
            .then(
              <SecondaryButton
                size="medium"
                mt="24px"
                style={{ width: 'fit-content' }}
                onClick={handleDownloadSignedPdfClick}
              >
                {t('overview.steps.cards.6.download')}
              </SecondaryButton>,
            )
            .equals(6)
            .then(
              <StyledButton mt="24px" onClick={() => openStep(6)}>
                {t('overview.steps.cards.6.button')}
              </StyledButton>,
            )
            .else(
              <StepDuration legend={t('overview.steps.cards.6.duration')} />,
            )}
        </Tier2Card>
        <Tier2Card
          title={match(step)
            .atLeast(8)
            .then(
              match(tier)
                .equals(Tier.tier2)
                .then(t('overview.steps.cards.7.approved'))
                .equals(Tier.tier99)
                .then(t('overview.steps.cards.7.notApproved'))
                .else(undefined),
            )
            .else(t('overview.steps.cards.7.title'))}
          description={match(step)
            .atLeast(8)
            .then(undefined)
            .equals(7)
            .then(t('overview.steps.cards.7.pendingDescription'))
            .else(t('overview.steps.cards.7.description'))}
          icon={match(step)
            .atLeast(8)
            .then(
              match(tier)
                .equals(Tier.tier2)
                .then(<Done color="white" />)
                .equals(Tier.tier99)
                .then(<Close color="white" size={30} />)
                .else(undefined),
            )
            .else(undefined)}
          isActive={step === 7}
          iconColor={match(tier)
            .equals(Tier.tier2)
            .then(Color.primary)
            .equals(Tier.tier99)
            .then(Color.dangerDark)
            .else(undefined)}
          step={step}
        >
          {match(step)
            .atLeast(8)
            .then(
              <Box>
                <Text color="grey">
                  {match(tier)
                    .equals(Tier.tier2)
                    .then(t('overview.steps.cards.7.approvedDescription'))
                    .equals(Tier.tier99)
                    .then(t('overview.steps.cards.7.notApprovedDescription'))
                    .else(undefined)}
                </Text>
                {match(tier)
                  .equals(Tier.tier2)
                  .then(
                    <LinkButton mt={3} label={t('startTrading')} to="/swap" />,
                  )
                  .equals(Tier.tier99)
                  .then(
                    <LinkButton mt={3} label={t('goToPools')} to="/pools" />,
                  )
                  .else(undefined)}
              </Box>,
            )
            .equals(7)
            .then(<Pending />)
            .else(
              <StepDuration legend={t('overview.steps.cards.7.duration')} />,
            )}
        </Tier2Card>
      </OverviewCardsContainer>
    </>
  )
}

export default Tier2Yes
