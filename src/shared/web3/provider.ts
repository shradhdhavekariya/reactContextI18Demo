import { BehaviorSubject } from 'rxjs'
import { providers } from 'ethers'
import config from 'src/environment'
import either from '../utils/either'
import { networkId$ } from '.'

const { defaultChainId, rpcUrls } = config

const getRpcUrl = (networkId: number) =>
  rpcUrls[networkId] || rpcUrls[defaultChainId]

export const getReadOnlyProvider = (
  networkId: number = networkId$.getValue(),
) => new providers.JsonRpcProvider(getRpcUrl(networkId), 'any')

export const readOnlyProvider = getReadOnlyProvider()

export const provider$ = new BehaviorSubject<providers.BaseProvider>(
  readOnlyProvider,
)

export const walletProvider$ = new BehaviorSubject<providers.Web3Provider | null>(
  null,
)

export const getSigner = (
  provider: providers.JsonRpcProvider | null = walletProvider$.getValue(),
) => either(() => provider?.getSigner(), undefined)

networkId$.subscribe((networkId) => {
  const currentProvider = provider$.getValue()

  if (
    !(provider$.getValue() instanceof providers.Web3Provider) &&
    // eslint-disable-next-line no-underscore-dangle
    currentProvider._network?.chainId !== networkId
  ) {
    provider$.next(getReadOnlyProvider(networkId))
  }
})
