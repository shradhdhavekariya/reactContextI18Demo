import { BehaviorSubject } from 'rxjs'
import config, { getContractAddressesByNetworkId } from 'src/environment'
import { NetworkId } from '../types/config'
import { isPolygon } from '../utils/config'

const { supportedChainIds, rpcUrls, graphqlUrls, defaultChainId } = config

const isNetworkSupported = (networkId: number) =>
  supportedChainIds.includes(networkId)

const checkNetwork = (networkId: number) =>
  isNetworkSupported(networkId) ? (networkId as NetworkId) : defaultChainId

export const getConfigForNetwork = (networkId: number) => ({
  ...getContractAddressesByNetworkId(checkNetwork(networkId)),
  graphqlUrl: graphqlUrls?.[isPolygon(networkId) ? 'polygon' : 'ethereum'],
  rpcUrl: rpcUrls[checkNetwork(networkId)],
})

const configForNetwork$ = new BehaviorSubject(
  getConfigForNetwork(defaultChainId),
)

export const getCurrentConfig = () => configForNetwork$.getValue()

export default configForNetwork$
