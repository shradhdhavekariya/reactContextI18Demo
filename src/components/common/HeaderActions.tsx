import { useTranslation } from 'react-i18next'
import { Add } from '@rimble/icons'
import { Flex, Box } from 'rimble-ui'
import { Link } from 'react-router-dom'
import { useState, useCallback } from 'react'
import { Color } from 'src/theme'
import { ReactComponent as WalletIcon } from 'src/assets/icons/Wallet.svg'
import PassportIcon from 'src/components/Passport/PassportIcon'
import { connect } from 'src/state/AppContext'
import { AppState } from 'src/shared/types/state'
import { VerificationStatus } from 'src/shared/enums'
import { getVerificationStep } from 'src/utils'
import { SmtContextProvider } from 'src/state/SmtContext'
import ButtonLink from './ButtonLink'
import RewardsWalletPopup from '../Popups/RewardsWalletPopup'
import SmtRewardsBadge from './SmtRewardsBadge'
import NetworkSelect from './NetworkSelect'

interface HeaderActionsProps extends Record<string, unknown> {
  addLiquidity?: boolean
  wallet?: boolean
  passport?: boolean
  currentStep?: number
  showPopup?: boolean
  networkSelect?: boolean
  setShowPopup?: (showPopup: boolean) => void
}

const HeaderActions = ({
  addLiquidity = false,
  wallet = false,
  passport = false,
  currentStep = 1,
  showPopup = false,
  networkSelect = true,
  setShowPopup = () => {},
}: HeaderActionsProps) => {
  const { t } = useTranslation('pools')
  const [showRewardsBalancePopup, setShowRewardsBalancePopup] = useState(false)

  const openModal = useCallback(() => {
    setShowRewardsBalancePopup(true)
    setShowPopup(true)
  }, [setShowPopup])

  const closeModal = useCallback(() => {
    setShowRewardsBalancePopup(false)
    setShowPopup(false)
  }, [setShowPopup])

  return (
    <Flex alignItems="center" display={['none', 'flex']} height="2.5rem">
      {addLiquidity && (
        <ButtonLink mr="12px" href="/pools">
          <Add />
          {t('addLiquidity')}
        </ButtonLink>
      )}
      {networkSelect && (
        <Box mr="12px">
          <NetworkSelect />
        </Box>
      )}
      <SmtContextProvider>
        {currentStep > 0 && <SmtRewardsBadge onClick={openModal} />}
        {wallet && (
          <Link to="/wallet">
            <WalletIcon
              height="28px"
              style={{ marginRight: '12px' }}
              fill={Color.primary}
            />
          </Link>
        )}
        {passport && (
          <Link to="/passport">
            <PassportIcon height="30px" fill={Color.primary} />
          </Link>
        )}
        <RewardsWalletPopup
          isOpen={showRewardsBalancePopup || showPopup}
          onClose={closeModal}
        />
      </SmtContextProvider>
    </Flex>
  )
}

const mapStateToProps = ({ user }: AppState) => {
  const { verificationStatus = VerificationStatus.notVerified } = user

  return {
    currentStep: getVerificationStep(verificationStatus),
  }
}
export default connect<HeaderActionsProps>(mapStateToProps)(HeaderActions)
