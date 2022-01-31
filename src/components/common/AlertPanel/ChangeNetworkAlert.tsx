import { Flash, Button } from 'rimble-ui'
import { useTranslation } from 'react-i18next'
import {
  ETHEREUM_NETWORK,
  onboard,
  switchNetwork,
  useNetworkId,
} from 'src/shared/web3'
import { ExtractProps } from 'src/shared/types/props'
import config from 'src/environment'
import { networkMap, networkNameMap } from 'src/consts'
import Alert from './Alert'
import AlertLink from './AlertLink'

const { isProduction, resources } = config
const { faq } = resources.docs.gettingStarted

const ChangeNetworkAlert = (props: ExtractProps<typeof Flash>) => {
  const { t } = useTranslation(['alerts'])
  const networkId = useNetworkId()

  const desiredNetwork = () => {
    switch (networkId) {
      case networkNameMap.Mumbai:
        return {
          networkId: isProduction()
            ? networkNameMap.Matic
            : networkNameMap.Mumbai,
        }
      default:
        return {
          networkId: isProduction()
            ? networkNameMap.Mainnet
            : networkNameMap.Rinkeby,
        }
    }
  }

  const changeNetwork = async () => {
    const { wallet } = onboard.getState()
    const network = desiredNetwork().networkId
    await switchNetwork(wallet, `${network}` as ETHEREUM_NETWORK)
  }

  return (
    <>
      <Alert
        title={t('changeNetwork.title')}
        controls={
          <>
            <Button
              onClick={changeNetwork}
              size="medium"
              px={3}
              mr="24px"
              fontWeight={4}
            >
              {t('changeNetwork.button')}
            </Button>
          </>
        }
        {...props}
      >
        {`Connect your wallet to ${
          networkMap[desiredNetwork().networkId]
        } to continue.`}
        <br />
        <AlertLink href={faq} target="_blank">
          {t('changeNetwork.link')}
        </AlertLink>
        {t('changeNetwork.sub-content')}
      </Alert>
    </>
  )
}

export default ChangeNetworkAlert
