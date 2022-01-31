import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Flex, Heading, Text, Loader } from 'rimble-ui'
import styled from 'styled-components'
import { Icon } from '@rimble/icons'
import { ReactComponent as RewardsIconSVG } from 'src/assets/icons/RewardsWhite.svg'
import { ReactComponent as StandardIconSvg } from 'src/assets/icons/Standard.svg'
import { ReactComponent as SilverIconSVG } from 'src/assets/icons/Silver.svg'
import { ReactComponent as GoldIconSVG } from 'src/assets/icons/Gold.svg'
import { ReactComponent as PlatinumIconSVG } from 'src/assets/icons/Platinum.svg'
import { Color, RewardsColor } from 'src/theme'
import { useHistory } from 'react-router-dom'
import { useSmt } from 'src/hooks/useSmt'
import { formatBigInt } from 'src/shared/utils/formatting'

interface LoyaltyLevelItemProps {
  targetLevel: number
  currentLevel: number
  smtBalance: number
  boostText: string
  pooledTokenBalance: number
}

export const loyaltyLevelCoefficient = {
  1: 0.01,
  2: 0.05,
  3: 0.1,
}

const getType = (level: number) => {
  switch (level) {
    case 1:
      return 'Silver'
    case 2:
      return 'Gold'
    case 3:
      return 'Platinum'
    default:
      return 'Standard'
  }
}

const getTypeColor = (level: number, isForLabel = false) => {
  switch (level) {
    case 0:
      return isForLabel ? RewardsColor.BaseDark : RewardsColor.Base
    case 1:
      return isForLabel ? RewardsColor.SilverDark : RewardsColor.Silver
    case 2:
      return RewardsColor.Gold
    case 3:
      return RewardsColor.Platinum
    default:
      return ''
  }
}
const getTypeIcon = (level: number) => {
  switch (level) {
    case 1:
      return <SilverIconSVG />
    case 2:
      return <GoldIconSVG />
    case 3:
      return <PlatinumIconSVG />
    default:
      return <StandardIconSvg />
  }
}

const getParagraph = (level: number) => {
  switch (level) {
    case 1:
      return '1-5%'
    case 2:
      return '5-10%'
    case 3:
      return '10%'
    default:
      return '0-1%'
  }
}

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  background: #ffffff;
  box-shadow: 0 2px 2px rgba(152, 162, 179, 0.15),
    0 12px 24px rgba(152, 162, 179, 0.15);
  border-radius: 8px;
  color: ${Color.grey};
  min-width: 228px;
`

const TitleLabel = styled.p`
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 32px;
  margin: 0;
`

const BottomSection = styled.div<{ isUpgrade: boolean }>`
  position: relative;
  display: flex;
  width: -webkit-fill-available;
  height: -webkit-fill-available;
  justify-content: center;
  align-items: center;
  border-top: 1px solid ${Color.border};
  padding: 0 12px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  height: 75px;
  cursor: ${(props) => (props.isUpgrade ? 'pointer' : 'unset')};
  background-color: ${(props) => (props.isUpgrade ? Color.primary : 'none')};
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

const SymbolChip = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 2px 4px;
  background: linear-gradient(0deg, #ffffff, #ffffff), #262626;
  opacity: 0.64;
  border-radius: 4px;
`

const RewardsIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(37.2deg, #489df0 20.15%, #0179ef 87.15%);
  margin-right: 10px;
`

const OR = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  left: 50%;
  top: 43%;
  transform: translateX(-50%);
  box-shadow: 1px 12px 12px 7px rgba(152, 162, 179, 0.15);

  > div {
    transform: rotate(-20deg);
  }
`

const ArrowIcon = styled.div`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
`

const LoyaltyLevelItem = ({
  targetLevel,
  currentLevel,
  smtBalance,
  boostText,
  pooledTokenBalance,
}: LoyaltyLevelItemProps) => {
  const history = useHistory()
  const { address: tokenId, exchangeRate: smtPrice, loading } = useSmt()
  const upgradeValue = useMemo(() => {
    if (loading || !smtPrice || targetLevel === 0) return undefined

    return formatBigInt(
      (pooledTokenBalance * loyaltyLevelCoefficient[targetLevel as 1 | 2 | 3]) /
        smtPrice -
        smtBalance,
      2,
    )
  }, [smtPrice, pooledTokenBalance, targetLevel, smtBalance, loading])

  const OnUpgrade = () => {
    history.push(`/swap?tokenOut=${tokenId}`)
  }

  const { t } = useTranslation('wallet')
  return (
    <Container
      style={{
        border: `${
          currentLevel === targetLevel ? `2px solid ${Color.primary}` : 'none'
        }`,
      }}
    >
      <SectionBadge style={{ background: getTypeColor(targetLevel) }} />
      <Flex
        flexDirection="column"
        width="100%"
        style={{ padding: '20px', flexGrow: 1 }}
      >
        <Flex alignItems="center" justifyContent="space-between">
          <TitleLabel style={{ color: getTypeColor(targetLevel, true) }}>
            {getType(targetLevel)}
          </TitleLabel>
          {getTypeIcon(targetLevel)}
        </Flex>
        <Heading
          as="h3"
          fontSize={4}
          lineHeight="title"
          fontWeight={5}
          m="0 0 8px 0"
          color="grey"
        >
          {t(boostText)}
        </Heading>
        <Flex alignItems="center">
          <RewardsIcon>
            <RewardsIconSVG width={20} height={15} />
          </RewardsIcon>
          <Text fontWeight="5" fontSize="5" color={Color.black}>
            {getParagraph(targetLevel)}
          </Text>
          {targetLevel === 3 && (
            <Text.span
              fontSize="13px"
              color={Color.grey}
              lineHeight="1"
              margin={0}
              ml="3px"
            >
              and
              <br /> more
            </Text.span>
          )}
        </Flex>
        {targetLevel === 3 && (
          <>
            <Text fontWeight="5" fontSize="5" color={Color.black}>
              $1M
            </Text>
            <OR>
              <Text fontWeight="5" fontSize="3" color={Color.black}>
                or
              </Text>
            </OR>
          </>
        )}
        <Text fontSize="2" lineHeight="2" color={Color.grey}>
          {t('loyaltyLevels.smtInWallet')}
        </Text>
      </Flex>
      <BottomSection isUpgrade={currentLevel < targetLevel}>
        {currentLevel > targetLevel && (
          <Text fontWeight="4" fontSize="1">
            {t('loyaltyLevels.unlocked').toUpperCase()}
          </Text>
        )}
        {currentLevel === targetLevel && (
          <Text fontWeight="4" fontSize="1" color={Color.primary}>
            {t('loyaltyLevels.current').toUpperCase()}
          </Text>
        )}
        {currentLevel < targetLevel && (
          <Box onClick={OnUpgrade}>
            <Flex style={{ justifyContent: 'center' }}>
              <Text
                fontWeight="4"
                color={Color.background}
                style={{ marginRight: 6 }}
              >
                {pooledTokenBalance
                  ? upgradeValue || <Loader color="white" />
                  : '---'}
              </Text>
              <SymbolChip>
                <Text fontWeight="3" fontSize="0" color={Color.primary}>
                  {t('loyaltyLevels.smt')}
                </Text>
              </SymbolChip>
            </Flex>
            <Text fontWeight="4" fontSize="1" color={Color.background}>
              {t('loyaltyLevels.buyToUpgrade')}
            </Text>
            <ArrowIcon>
              <Icon name="ArrowForward" size={20} color="white" />
            </ArrowIcon>
          </Box>
        )}
      </BottomSection>
    </Container>
  )
}

export default LoyaltyLevelItem
