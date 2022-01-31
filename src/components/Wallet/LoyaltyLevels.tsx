import { Card, Heading, Text } from 'rimble-ui'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import Dialog from 'src/components/common/Dialog'
import { ReactComponent as RewardsWhiteIconSVG } from 'src/assets/icons/RewardsWhite.svg'
import { ReactComponent as RewardsBgIconSVG } from 'src/assets/icons/RewardsBg.svg'
import LoyaltyLevelItem from './LoyaltyLevelItem'

interface LoyaltyLevelsProps {
  level: number
  isOpen: boolean
  onClose: () => void
  smtBalance: number
  pooledTokenBalance: number
}

const RewardsIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  background: #2b79ef;
  border-radius: 50%;
`

const BgRewardsIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 17%;
`

const StyledWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 16px;

  @media (min-width: ${({ theme }) => theme.breakpoints[0]}) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints[2]}) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 16px;
  }
`

const LoyaltyLevels = ({
  isOpen,
  onClose,
  level,
  smtBalance,
  pooledTokenBalance,
}: LoyaltyLevelsProps) => {
  const { t } = useTranslation('wallet')

  return (
    <Dialog
      isOpen={isOpen}
      width={['100%', 'auto']}
      minWidth={[0, 0, '428px']}
      onClose={onClose}
      p="24px"
    >
      <Card
        p={0}
        borderRadius={1}
        boxShadow={4}
        border="0"
        flexDirection="column"
        alignItems="center"
        display={isOpen ? 'flex' : 'none'}
        zIndex={1}
        overflowY="auto"
        webkit-scrollbar-width={0}
      >
        <RewardsIcon>
          <RewardsWhiteIconSVG width={58} height={43} />
        </RewardsIcon>
        <Heading as="h3" fontSize={5} lineHeight="28px" fontWeight={5} mt={3}>
          {t('loyaltyLevels.title')}
        </Heading>
        <Text.p color="grey" mb={3}>
          {t('loyaltyLevels.description')}
        </Text.p>

        <StyledWrapper>
          <LoyaltyLevelItem
            targetLevel={0}
            currentLevel={level}
            smtBalance={smtBalance}
            boostText="loyaltyLevels.baseParagraph"
            pooledTokenBalance={pooledTokenBalance}
          />
          <LoyaltyLevelItem
            targetLevel={1}
            currentLevel={level}
            smtBalance={smtBalance}
            pooledTokenBalance={pooledTokenBalance}
            boostText="loyaltyLevels.silverParagraph"
          />
          <LoyaltyLevelItem
            targetLevel={2}
            currentLevel={level}
            smtBalance={smtBalance}
            pooledTokenBalance={pooledTokenBalance}
            boostText="loyaltyLevels.goldParagraph"
          />
          <LoyaltyLevelItem
            targetLevel={3}
            currentLevel={level}
            smtBalance={smtBalance}
            pooledTokenBalance={pooledTokenBalance}
            boostText="loyaltyLevels.platinumParagraph"
          />
        </StyledWrapper>
      </Card>
      <BgRewardsIcon>
        <RewardsBgIconSVG height={170} />
      </BgRewardsIcon>
    </Dialog>
  )
}

export default LoyaltyLevels
