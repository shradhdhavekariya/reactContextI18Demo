import { useCallback } from 'react'
import { disconnected } from 'src/state/actions/app'
import { ethers, providers } from 'ethers'
import Onboard from 'bnc-onboard'
import { Wallet } from 'bnc-onboard/dist/src/interfaces'
import { getReadOnlyProvider, provider$ } from 'src/shared/web3'
import config from 'src/environment'
import { wallets } from 'src/config/wallets'
import { removeFromStorage, saveToStorage } from 'src/services/local-storage'
import { accountChanged } from 'src/state/actions/users'
import store from 'src/store'
import { alertAdded } from 'src/state/actions/snackbar'
import { AlertVariant } from 'src/components/common/Snackbar/types'
import { removeAuthToken } from 'src/utils'
import { useSnackbar } from 'src/components/common/Snackbar'
import configForNetwork$, {
  getConfigForNetwork,
} from '../observables/configForNetwork'
import { account$ } from './account'
import { networkId$ } from './networkId'
import useSafeCallback from '../hooks/useSafeCallback'
import { walletProvider$ } from './provider'
import { commonEVMNetworks, EVMNetwork } from '../consts'
import { propEquals } from '../utils/collection/filters'

export enum ETHEREUM_NETWORK {
  UNKNOWN = '0',
  MAINNET = '1',
  MORDEN = '2',
  ROPSTEN = '3',
  RINKEBY = '4',
  GOERLI = '5',
  KOVAN = '42',
  BSC = '56',
  XDAI = '100',
  POLYGON = '137',
  ENERGY_WEB_CHAIN = '246',
  LOCAL = '4447',
  ARBITRUM = '42161',
  VOLTA = '73799',
  MUMBAI = '80001',
}

const WALLET_ERRORS = {
  UNRECOGNIZED_CHAIN: 4902,
  USER_REJECTED: 4001,
}

const { defaultChainId, isProduction } = config

let lastSelectedWallet: string | null = null

export const CACHED_WALLET_KEY = 'SELECTED_WALLET'

export const onboard = Onboard({
  networkId: defaultChainId,
  subscriptions: {
    wallet: (wallet) => {
      removeFromStorage('walletconnect')
      if (wallet.name === 'MetaMask') {
        provider$.next(new providers.Web3Provider(wallet.provider))
      } else {
        provider$.next(getReadOnlyProvider())
      }

      if (wallet.provider) {
        walletProvider$.next(new providers.Web3Provider(wallet.provider, 'any'))
        lastSelectedWallet = wallet.name
      } else {
        walletProvider$.next(null)
        lastSelectedWallet = null
        removeAuthToken()
      }
    },
    address: (address) => {
      const cleanAddress = address?.toLowerCase()

      account$.next(cleanAddress)

      if (cleanAddress) {
        saveToStorage(CACHED_WALLET_KEY, lastSelectedWallet)
      } else {
        removeFromStorage('walletconnect')
        removeFromStorage(CACHED_WALLET_KEY)
        removeAuthToken()
      }

      store.dispatch(
        cleanAddress ? accountChanged(cleanAddress) : disconnected(),
      )
    },
    network: (networkId) => {
      networkId$.next(networkId)
      configForNetwork$.next(getConfigForNetwork(networkId))
    },
  },
  hideBranding: true,
  walletSelect: {
    wallets,
  },
  walletCheck: [{ checkName: 'connect' }],
})

export const shouldSwitchNetwork = (
  wallet = onboard.getState()?.wallet,
): boolean => {
  const currentNetwork = wallet?.provider?.networkVersion

  const desiredNetworks = isProduction() ? ['1', '137'] : ['4', '80001']

  return !!currentNetwork && !desiredNetworks.includes(currentNetwork)
}

const requestAdd = async (
  wallet: Wallet,
  network: EVMNetwork,
): Promise<void> => {
  await wallet.provider.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: `0x${(+(network as EVMNetwork).chainId).toString(16)}`,
        chainName: (network as EVMNetwork).chainName,
        nativeCurrency: (network as EVMNetwork).nativeCurrency,
        rpcUrls: (network as EVMNetwork).rpcUrls,
        blockExplorerUrls: (network as EVMNetwork).blockExplorerUrls,
      },
    ],
  })
}

export const addNetwork = async (
  wallet: Wallet,
  network: EVMNetwork,
): Promise<void> => {
  try {
    await requestAdd(wallet, network)
  } catch (e) {
    if (e.code === WALLET_ERRORS.USER_REJECTED) {
      return
    }
    store.dispatch(
      alertAdded({
        message: 'Unrecognized chain!',
        variant: AlertVariant.error,
      }),
    )
  }
}
/**
 * Switch the chain assuming it's MetaMask.
 * @see https://github.com/MetaMask/metamask-extension/pull/10905
 */
const requestSwitch = async (
  wallet: Wallet,
  chainId: ETHEREUM_NETWORK,
): Promise<void> =>
  new Promise((resolve) =>
    wallet.provider
      .request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: ethers.utils.hexValue(`0x${Number(chainId).toString(16)}`),
          },
        ],
      })
      .then(resolve)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((e: any) => {
        if (e.code === 4902) {
          const network = commonEVMNetworks.find(
            propEquals('networkId', parseInt(chainId, 16)),
          )
          resolve(addNetwork(wallet, network as EVMNetwork))
        }
      }),
  )

export const switchNetwork = async (
  wallet: Wallet,
  chainId: ETHEREUM_NETWORK,
): Promise<void> => {
  try {
    await requestSwitch(wallet, chainId)
  } catch (e) {
    if (e.code === WALLET_ERRORS.USER_REJECTED) {
      return
    }
    store.dispatch(
      alertAdded({
        message: 'Unrecognized chain!',
        variant: AlertVariant.error,
      }),
    )
  }
}

const checkWallet = async (): Promise<boolean> => {
  const ready = onboard.walletCheck()
  if (shouldSwitchNetwork()) {
    try {
      await switchNetwork(
        onboard.getState().wallet,
        defaultChainId.toString() as ETHEREUM_NETWORK,
      )
      return true
    } catch (e) {
      e.log()
      return false
    }
  }

  return ready
}

export const connectWallet = async (wallet?: string): Promise<boolean> => {
  const walletSelected = await onboard.walletSelect(wallet)

  return walletSelected && checkWallet()
}

export const disconnectWallet = async () => {
  try {
    await onboard.walletReset()
  } catch (e) {
    // do nothing for now
  }
}

export const useConnectWallet = (callback?: (success: boolean) => void) => {
  const successCallback = useSafeCallback(callback)
  const { addError } = useSnackbar()

  return useCallback(
    async (wallet?: string) => {
      try {
        const success = await connectWallet(wallet)
        successCallback(success)
        return success
      } catch (e) {
        addError(e)
      }
      successCallback(false)
      return false
    },
    [addError, successCallback],
  )
}
