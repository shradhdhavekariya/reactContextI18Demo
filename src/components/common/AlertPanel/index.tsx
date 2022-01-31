import match from 'conditional-expression'
import { Tier } from 'src/shared/enums'
import { useAccount, useNetworkId } from 'src/shared/web3'
import { useInitiated, useIsLoggedIn, useTier } from 'src/state/hooks'
import CompletePassportAlert from './CompletePassportAlert'
import ConnectWalletAlert from './ConnectWalletAlert'
import CompleteSignInAlert from './CompleteSignInAlert'
import config from '../../../environment'
import ChangeNetworkAlert from './ChangeNetworkAlert'

interface AlertPanelProps {
  show?: boolean
  promptSignIn?: boolean
}

const AlertPanel = ({ show = true, promptSignIn = false }: AlertPanelProps) => {
  const account = useAccount()
  const initiated = useInitiated()
  const networkId = useNetworkId()
  const supportedNetworks = config.supportedChainIds
  const tier = useTier()
  const isLoggedIn = useIsLoggedIn()

  if (!initiated || !show) {
    return null
  }

  return !account ? (
    <ConnectWalletAlert maxWidth={['auto', 'auto', '735px']} />
  ) : (
    <>
      {!supportedNetworks.includes(networkId) ? (
        <ChangeNetworkAlert />
      ) : (
        match(tier)
          .equals(Tier.tier0)
          .then(<CompletePassportAlert maxWidth={['auto', 'auto', '735px']} />)
          .else(
            promptSignIn && !isLoggedIn ? (
              <CompleteSignInAlert maxWidth={['auto', 'auto', '735px']} />
            ) : null,
          )
      )}
    </>
  )
}

export default AlertPanel
