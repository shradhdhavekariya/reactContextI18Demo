import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Flex, Loader, Text } from 'rimble-ui'
import styled from 'styled-components'
import { Color, RewardsColor } from 'src/theme'
import { useHistory } from 'react-router-dom'
import { useSmt } from 'src/hooks/useSmt'
import { formatBigInt } from 'src/shared/utils/formatting'
import { loyaltyLevelCoefficient } from 'src/components/Wallet/LoyaltyLevelItem'

interface LoyaltyLevelItemProps {
  targetLevel: number
  currentLevel: number
  smtBalance: number
  pooledTokenBalance: number
  paragraph: string
  onClosePopup: () => void
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px;
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 2px 2px rgba(152, 162, 179, 0.15),
    0px 12px 24px rgba(152, 162, 179, 0.15);
  border-radius: 8px;
  color: ${Color.grey};
`

const TitleLabel = styled.p`
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 32px;
  margin: 8px 0 0 0;
`

const BottomSection = styled.div<{ isUpgrade: boolean }>`
  display: flex;
  width: -webkit-fill-available;
  height: -webkit-fill-available;
  justify-content: center;
  align-items: center;
  border-top: 1px solid ${Color.border};
  padding: 12px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
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
  margin: 0px 0px;
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

const LoyaltyLevelItem = ({
  targetLevel,
  currentLevel,
  smtBalance,
  pooledTokenBalance,
  paragraph,
  onClosePopup,
}: LoyaltyLevelItemProps) => {
  const { t } = useTranslation('pools')
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

  const OnUpgrade = (amountOut: string) => {
    onClosePopup()
    if (amountOut)
      history.push(`/swap?amountOut=${amountOut}&tokenOut=${tokenId}`)
    else history.push(`/swap?tokenOut=${tokenId}`)
  }

  return (
    <Container
      style={{
        border: `${
          currentLevel === targetLevel ? `2px solid ${Color.primary}` : 'none'
        }`,
      }}
    >
      <SectionBadge style={{ background: getTypeColor(targetLevel) }} />
      <TitleLabel style={{ color: getTypeColor(targetLevel) }}>
        {getType(targetLevel)}
      </TitleLabel>
      <Text
        fontWeight="5"
        fontSize="2"
        lineHeight="2"
        style={{ padding: '16px 0', color: Color.black }}
      >
        {paragraph}
      </Text>
      <BottomSection isUpgrade={currentLevel < targetLevel}>
        {currentLevel > targetLevel && (
          <Text fontWeight="4" fontSize="1">
            {t('rewardsBalance.loyaltyLevel.unlocked').toUpperCase()}
          </Text>
        )}
        {currentLevel === targetLevel && (
          <Text fontWeight="4" fontSize="1" color={Color.primary}>
            {t('rewardsBalance.loyaltyLevel.current').toUpperCase()}
          </Text>
        )}
        {currentLevel < targetLevel && (
          <Box onClick={() => OnUpgrade(upgradeValue || '')}>
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
                  {t('rewardsBalance.smt')}
                </Text>
              </SymbolChip>
            </Flex>
            <Text fontWeight="4" fontSize="1" color={Color.background}>
              {t('rewardsBalance.loyaltyLevel.toUpgrade').toUpperCase()}
            </Text>
          </Box>
        )}
      </BottomSection>
    </Container>
  )
}

export default LoyaltyLevelItem
