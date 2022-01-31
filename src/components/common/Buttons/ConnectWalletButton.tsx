import { ReactElement, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import StyledButton from 'src/components/StyledButton'
import { useSnackbar } from 'src/components/common/Snackbar'
import { AlertVariant } from 'src/components/common/Snackbar/types'
import { disconnectWallet, useAccount, useConnectWallet } from 'src/shared/web3'
import ConnectedSuccessfullyModal from 'src/components/ConnectionModal/ConnectedSuccessfullyModal'

interface FooterProps {
  onNext?: () => void
  render?: (
    open: () => void,
    disconnect: () => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => ReactElement<any, any> | null
}

const ConnectWalletButton = ({
  onNext,
  render = (open) => <StyledButton onClick={open}>Connect wallet</StyledButton>,
}: FooterProps) => {
  const { addAlert } = useSnackbar()
  const { t } = useTranslation(['onboarding', 'navigation', 'alerts'])
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const account = useAccount()

  const connect = useConnectWallet(
    useCallback((success) => success && setSuccessModalOpen(success), []),
  )

  const closeSuccessModal = useCallback(() => {
    if (successModalOpen) {
      setSuccessModalOpen(false)
    }
  }, [successModalOpen])

  const handleConnectSuccess = async () => {
    await onNext?.()
    closeSuccessModal()
  }

  const logout = () => {
    disconnectWallet()
    addAlert(t('navigation:userDisconnected'), {
      variant: AlertVariant.warning,
      autoDismissible: true,
    })
  }

  return (
    <>
      {render(connect, logout)}
      {successModalOpen && (
        <ConnectedSuccessfullyModal
          address={account || ''}
          onClose={closeSuccessModal}
          onNext={handleConnectSuccess}
          nextButtonLabel={t('alerts:signIn.button')}
        />
      )}
    </>
  )
}

export default ConnectWalletButton
