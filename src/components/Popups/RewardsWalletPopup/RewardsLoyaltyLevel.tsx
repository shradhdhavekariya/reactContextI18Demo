import React from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Box, Text, Loader } from 'rimble-ui'
import Grid from 'src/components/common/Grid'
import { Color } from 'src/theme'
import Divider from 'src/components/common/Divider'
import { useAccount } from 'src/shared/web3'
import useLoyaltyLevel from 'src/shared/hooks/useLoyaltyLevel/useLoyaltyLevel'
import RewardsPopupSectionTitle from './RewardsPopupSectionTitle'
import LoyaltyLevelItem from './LoyaltyLevelItem'

interface RewardsLoyaltyLevelProps {
  onClosePopup: () => void
}

const RewardsLoyaltyLevel = ({ onClosePopup }: RewardsLoyaltyLevelProps) => {
  const { t } = useTranslation('pools')
  const account = useAccount()
  const {
    level,
    value: type,
    smtBalance,
    pooledTokenBalance,
    loading,
  } = useLoyaltyLevel(account || '')

  const titleInfoBody = () => {
    return <></>
  }

  return (
    <>
      <Flex>
        <Box width={1 / 2}>
          <RewardsPopupSectionTitle
            title={t('rewardsBalance.loyaltyLevel.title')}
            content={titleInfoBody()}
          />
        </Box>
        <Box width={1 / 2} style={{ textAlign: 'right' }}>
          <Text fontWeight="bold" fontSize="3" color={Color.black}>
            {!loading && level}
          </Text>
        </Box>
      </Flex>
      <Divider />
      {loading ? (
        <Text.span fontWeight={2} color="grey" textAlign="center">
          <Loader size="30px" m="auto" />
        </Text.span>
      ) : (
        <Grid gridTemplateColumns="1fr 1fr 1fr 1fr" gridGap={[3, 3, 3]}>
          <LoyaltyLevelItem
            key="loyalty-level-1"
            targetLevel={0}
            currentLevel={type}
            smtBalance={smtBalance}
            pooledTokenBalance={pooledTokenBalance}
            paragraph={t('rewardsBalance.loyaltyLevel.baseParagraph')}
            onClosePopup={onClosePopup}
          />
          <LoyaltyLevelItem
            key="loyalty-level-2"
            targetLevel={1}
            currentLevel={type}
            smtBalance={smtBalance}
            pooledTokenBalance={pooledTokenBalance}
            paragraph={t('rewardsBalance.loyaltyLevel.silverParagraph')}
            onClosePopup={onClosePopup}
          />
          <LoyaltyLevelItem
            key="loyalty-level-3"
            targetLevel={2}
            currentLevel={type}
            smtBalance={smtBalance}
            pooledTokenBalance={pooledTokenBalance}
            paragraph={t('rewardsBalance.loyaltyLevel.goldParagraph')}
            onClosePopup={onClosePopup}
          />
          <LoyaltyLevelItem
            key="loyalty-level-4"
            targetLevel={3}
            currentLevel={type}
            smtBalance={smtBalance}
            pooledTokenBalance={pooledTokenBalance}
            paragraph={t('rewardsBalance.loyaltyLevel.platinumParagraph')}
            onClosePopup={onClosePopup}
          />
        </Grid>
      )}
    </>
  )
}

export default RewardsLoyaltyLevel
