import { useTranslation } from 'react-i18next'
import { Box, Card, Heading, Text } from 'rimble-ui'
import match from 'conditional-expression'
import { connect } from 'src/state/AppContext'
import { AppState, UserProfile } from 'src/shared/types/state'
import DetailBlock from 'src/components/common/DetailBlock'
import InternalLink from 'src/components/common/InternalLink'
import StatusBlock from 'src/components/common/StatusBlock'
import Grid from 'src/components/common/Grid'
import { hasCompletedVerification } from 'src/utils'
import { KycProvider, Tier, VerificationStatus } from 'src/shared/enums'
import { useKycProvider, useTier } from 'src/state/hooks'

const PassportDetails = ({ user }: Record<'user', UserProfile>) => {
  const tier = useTier()
  const kycProvider = useKycProvider()

  const verified = hasCompletedVerification(VerificationStatus.kycVerified)(
    user.verificationStatus,
  )

  const { t } = useTranslation('passport')

  return (
    <Card
      p={['16px', '24px']}
      borderRadius={1}
      boxShadow={4}
      border="0"
      width="100%"
      flexDirection="column"
    >
      <Heading
        as="h3"
        fontSize={3}
        lineHeight="28px"
        fontWeight={5}
        color="grey"
        m={0}
      >
        {t('myDetails.header')}
      </Heading>
      <Grid gridTemplateColumns={['1fr', '1fr 1fr 1fr']} gridGap="32px">
        <DetailBlock bold namespace="passport" label="myDetails.status">
          <StatusBlock
            iconSize="14"
            iconColor={match(tier)
              .equals(Tier.tier2)
              .then('success')
              .equals(Tier.tier1)
              .then('success')
              .else('danger')}
            content={
              <Text color="black" fontWeight={4} fontSize={2}>
                {match(tier)
                  .equals(Tier.tier2)
                  .then(t('status.verified.unlimited'))
                  .equals(Tier.tier1)
                  .then(t('status.verified.limited'))
                  .equals(Tier.tier90)
                  .then(t('status.suspended'))
                  .equals(Tier.tier99)
                  .then(t('status.rejected'))
                  .else(t('status.notVerified'))}
              </Text>
            }
          />
        </DetailBlock>
        <DetailBlock
          namespace="passport"
          label="myDetails.fullName"
          content={
            verified
              ? user?.fullName ?? `${user?.givenName} ${user?.familyName}`
              : '-'
          }
        />
        <DetailBlock
          namespace="passport"
          label="myDetails.emailAddress"
          content={verified ? user.email : '-'}
        />
        <Box>
          <DetailBlock
            namespace="passport"
            label="myDetails.tradingLimit"
            helpText={t('myDetails.tradingLimitHelpText')}
          >
            <Box mt={1}>
              {match(tier)
                .equals(Tier.tier90)
                .then(t('myDetails.suspended'))
                .equals(Tier.tier99)
                .then(t('myDetails.rejected'))
                .equals(Tier.tier2)
                .then(t('myDetails.unlimited'))
                .equals(Tier.tier1)
                .then(
                  match(kycProvider)
                    .equals(KycProvider.yes)
                    .then(
                      <>
                        {t('myDetails.5000')}
                        <br />
                        <InternalLink to="/onboarding" mt={1}>
                          {t('myDetails.upgrade')}
                        </InternalLink>
                      </>,
                    )
                    .equals(KycProvider.yoti)
                    .then(
                      <>
                        {t('myDetails.5000')}
                        <br />
                        {t('myDetails.upgradePending')}
                      </>,
                    )
                    .else(undefined),
                )
                .else(t('myDetails.setupPassport'))}
            </Box>
          </DetailBlock>
          <Box pt={2}>
            <DetailBlock namespace="passport" label="myDetails.bankAccount">
              <StatusBlock iconSize="14" iconColor="danger" content="-" />
            </DetailBlock>
          </Box>
        </Box>
        <DetailBlock
          namespace="passport"
          label="myDetails.nationality"
          content={verified ? user.nationalities?.[0] || '-' : '-'}
        />
        <DetailBlock namespace="passport" label="myDetails.residentialAddress">
          {verified ? (
            <>
              <Text fontWeight={2} color="black" mt={1}>
                {user.structuredAddress?.street_address}
              </Text>
              <Text fontWeight={2} color="black" mt={1}>
                {user.structuredAddress?.postal_code}
              </Text>
              <Text fontWeight={2} color="black" mt={1}>
                {user.structuredAddress?.locality}
              </Text>
              <Text fontWeight={2} color="black" mt={1}>
                {user.structuredAddress?.country}
              </Text>
            </>
          ) : (
            <Text fontWeight={2} color="black" mt={1}>
              -
            </Text>
          )}
        </DetailBlock>
      </Grid>
    </Card>
  )
}

const mapStateToProps = ({ user }: AppState) => ({ user })

export default connect(mapStateToProps)(PassportDetails)
