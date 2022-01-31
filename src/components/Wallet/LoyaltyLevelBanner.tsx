import React, { useCallback, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Flex, Heading, Text, Loader } from 'rimble-ui'
import { Icon } from '@rimble/icons'
import styled from 'styled-components'
import { ReactComponent as RewardsIconSVG } from 'src/assets/icons/RewardsWhite.svg'
import { ReactComponent as StandardIconSvg } from 'src/assets/icons/Standard.svg'
import { ReactComponent as SilverIconSVG } from 'src/assets/icons/Silver.svg'
import { ReactComponent as GoldIconSVG } from 'src/assets/icons/Gold.svg'
import { ReactComponent as PlatinumIconSVG } from 'src/assets/icons/Platinum.svg'
import { Color, RewardsColor } from 'src/theme'
import useLoyaltyLevel from 'src/shared/hooks/useLoyaltyLevel/useLoyaltyLevel'
import { WalletContext } from './WalletContext'

interface LoyaltyBannerProps {
  setShowPopup: (showPopup: boolean) => void
}

const getTypeColor = (type: string, isForLabel = false) => {
  switch (type) {
    case 'Standard':
      return isForLabel ? RewardsColor.BaseDark : RewardsColor.Base
    case 'Silver':
      return isForLabel ? RewardsColor.SilverDark : RewardsColor.Silver
    case 'Gold':
      return RewardsColor.Gold
    case 'Platinum':
      return RewardsColor.Platinum
    default:
      return ''
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'Silver':
      return <SilverIconSVG />
    case 'Gold':
      return <GoldIconSVG />
    case 'Platinum':
      return <PlatinumIconSVG />
    default:
      return <StandardIconSvg />
  }
}

const getBoostPercent = (type: string) => {
  switch (type) {
    case 'Silver':
      return '+25%'
    case 'Gold':
      return '+50%'
    case 'Platinum':
      return '+100%'
    default:
      return 'Participate'
  }
}

const Container = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 20px;
  padding: 0;
  background: #ffffff;
  box-shadow: 0 2px 2px rgba(152, 162, 179, 0.15),
    0 12px 24px rgba(152, 162, 179, 0.15);
  border-radius: 8px;
  color: ${Color.grey};
  cursor: pointer;
`

interface LoyaltyLevelBannerContentProps {
  centerH: boolean
}

const Content = styled.div<LoyaltyLevelBannerContentProps>`
  width: 100%;
  padding: 15px 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-right: 135px;
  justify-content: ${(props) => (props.centerH ? 'center' : '')};
  @media (max-width: 1070px) {
    flex-direction: column;
    padding: 65px 0 20px;
    row-gap: 20px;
    p {
      margin: 0 auto;
    }
  }
`

const TitleLabel = styled.p`
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 32px;
  margin: 0 20px 0 0;
`

const SectionBadge = styled.div`
  height: 8px;
  position: static;
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
  margin: 0;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`

const RewardsIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(37.2deg, #489df0 20.15%, #0179ef 87.15%);
  margin: 0 5px 0 20px;
  @media (max-width: 992px) {
    margin-left: 0;
  }
`

const OpenModal = styled.div`
  position: absolute;
  right: 20px;
  top: 35px;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding-right: 15px;
  svg {
    margin-left: 10px;
  }
`

const LoyaltyBanner = ({ setShowPopup }: LoyaltyBannerProps) => {
  const { selectedAccount } = useContext(WalletContext)
  const { t } = useTranslation('wallet')
  const { level: type, loading } = useLoyaltyLevel(selectedAccount || '')
  const openModal = useCallback(() => setShowPopup(true), [setShowPopup])

  if (!selectedAccount) return <></>

  return (
    <Container onClick={openModal}>
      <SectionBadge style={{ background: getTypeColor(type) }} />
      <Content centerH={loading}>
        {loading ? (
          <Text.span fontWeight={2} color="grey" textAlign="center">
            <Loader size="30px" m="auto" />
          </Text.span>
        ) : (
          <>
            <TitleLabel style={{ color: getTypeColor(type, true) }}>
              {type}
            </TitleLabel>
            {getTypeIcon(type)}
            <Box mr="20px" ml="20px">
              <Text fontSize="1" lineHeight="2" color={Color.grey}>
                {t('loyaltyLevels.loyaltyLevel')}
              </Text>
            </Box>
            <Heading
              as="h3"
              fontSize={4}
              lineHeight="title"
              fontWeight="800"
              m="0"
              color="primary"
            >
              {getBoostPercent(type)}
            </Heading>
            <Flex alignItems="center">
              <RewardsIcon>
                <RewardsIconSVG width={20} height={15} />
              </RewardsIcon>
              <Flex direction="column" flexDirection="column">
                <Text fontSize="1" lineHeight="0.9" color={Color.grey}>
                  {t('loyaltyLevels.smt')}
                </Text>
                <Text fontSize="1" lineHeight="0.9" color={Color.grey}>
                  {t('loyaltyLevels.rewards')}
                </Text>
              </Flex>
            </Flex>
            <OpenModal>
              <Text
                fontSize="1"
                lineHeight="2"
                fontWeight={5}
                color={Color.primary}
              >
                {t('loyaltyLevels.youAre')} {type}
              </Text>
              <Icon name="ArrowForward" size={20} color="primary" />
            </OpenModal>
          </>
        )}
      </Content>
    </Container>
  )
}

export default LoyaltyBanner
