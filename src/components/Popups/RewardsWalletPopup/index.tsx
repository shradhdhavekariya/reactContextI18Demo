import { useState } from 'react'
import Drawer from '@material-ui/core/Drawer'
import styled from 'styled-components'
import { ReactComponent as CloseIconSVG } from 'src/assets/icons/Close.svg'
import { Icon } from '@rimble/icons'
import { Text } from 'rimble-ui'
import { useTranslation } from 'react-i18next'
import { getAmountReleaseThisWeek } from 'src/shared/utils/calculate-release-thisweek'
import RewardsLoyaltyLevel from './RewardsLoyaltyLevel'
import TokenInfo from './TokenInfo'
import RewardsGeneralInfo from './RewardsGeneralInfo'

interface RewardsWalletPopupProps {
  isOpen: boolean
  onClose: () => void
}

interface CloseIconProps {
  onClick: () => void
}

const RewardsWalletPopupContainer = styled.div`
  position: relative;
  width: 560px;
  flex-direction: column;
  align-items: center;
  padding: 28px;
`

const CloseIcon = styled.div<CloseIconProps>`
  position: absolute;
  top: 28px;
  right: 28px;
  cursor: pointer;
`

const BackIcon = styled.div`
  position: absolute;
  top: 28px;
  left: 28px;
  display: flex;
  cursor: pointer;
`

const RewardsWalletPopup = ({ isOpen, onClose }: RewardsWalletPopupProps) => {
  const { t } = useTranslation('navigation')
  const [tabIndex, setTabIndex] = useState(1)

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose} elevation={0}>
      <RewardsWalletPopupContainer>
        {tabIndex === 2 && (
          <BackIcon onClick={() => setTabIndex(1)}>
            <Icon name="ArrowBack" size="20px" />
            <Text.span ml={2} fontWeight={5} lineHeight={1.3}>
              {t('back')}
            </Text.span>
          </BackIcon>
        )}
        <CloseIcon onClick={onClose}>
          <CloseIconSVG />
        </CloseIcon>
        {tabIndex === 1 && (
          <>
            <RewardsGeneralInfo
              handleChangeTab={(index: number) => setTabIndex(index)}
            />
            <RewardsLoyaltyLevel onClosePopup={onClose} />
          </>
        )}
        {tabIndex === 2 && (
          <>
            <TokenInfo
              releaseThisWeek={getAmountReleaseThisWeek()}
              onClosePopup={onClose}
            />
          </>
        )}
      </RewardsWalletPopupContainer>
    </Drawer>
  )
}

export default RewardsWalletPopup
