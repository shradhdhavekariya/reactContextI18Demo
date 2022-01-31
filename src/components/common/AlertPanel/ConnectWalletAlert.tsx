import { useState, useCallback } from 'react'
import { Flash, Button } from 'rimble-ui'
import { useTranslation } from 'react-i18next'
import useVerify from 'src/hooks/useVerify'
import { useAccount, useConnectWallet } from 'src/shared/web3'
import { ExtractProps } from 'src/shared/types/props'
import config from 'src/environment'
import ConnectedSuccessfullyModal from 'src/components/ConnectionModal/ConnectedSuccessfullyModal'
import Alert from './Alert'
import AlertLink from './AlertLink'

const { passportLinkingYourWallet } = config.resources.docs.coreConcepts

const ConnectWalletAlert = (props: ExtractProps<typeof Flash>) => {
  const { t } = useTranslation(['alerts'])
  const account = useAccount()
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const { verify } = useVerify()

  const connect = useConnectWallet(
    useCallback((success) => success && setSuccessModalOpen(success), []),
  )

  const closeSuccessModal = () => setSuccessModalOpen(false)

  return (
    <>
      <Alert
        title={t('connect.title')}
        controls={
          <>
            <Button
              onClick={connect}
              size="medium"
              px={3}
              mr="24px"
              fontWeight={4}
            >
              {t('connect.button')}
            </Button>
            <AlertLink href={passportLinkingYourWallet} target="_blank">
              {t('connect.link')}
            </AlertLink>
          </>
        }
        {...props}
      >
        {t('connect.content')}
      </Alert>
      {successModalOpen && (
        <ConnectedSuccessfullyModal
          address={account || ''}
          onClose={closeSuccessModal}
          onNext={verify}
        />
      )}
    </>
  )
}

export default ConnectWalletAlert
