import { WalletInitOptions } from 'bnc-onboard/dist/src/interfaces'
import config from 'src/environment'

const { infuraId, rpcUrls, defaultChainId } = config

export enum WALLETS {
  METAMASK = 'metamask',
  WALLET_CONNECT = 'walletConnect',
  TREZOR = 'trezor',
  LEDGER = 'ledger',
  TRUST = 'trust',
  FORTMATIC = 'fortmatic',
  PORTIS = 'portis',
  AUTHEREUM = 'authereum',
  TORUS = 'torus',
  COINBASE = 'coinbase',
  WALLET_LINK = 'walletLink',
  OPERA = 'opera',
  OPERA_TOUCH = 'operaTouch',
  LATTICE = 'lattice',
  KEYSTONE = 'keystone',
}

export const wallets: WalletInitOptions[] = [
  {
    walletName: WALLETS.METAMASK,
    preferred: true,
  },
  {
    walletName: WALLETS.WALLET_CONNECT,
    infuraKey: infuraId,
    preferred: true,
  },
  {
    walletName: WALLETS.LEDGER,
    rpcUrl: rpcUrls[defaultChainId],
    preferred: true,
  },
  {
    walletName: WALLETS.TREZOR,
    appUrl: document.location.host,
    rpcUrl: rpcUrls[defaultChainId],
    preferred: true,
    email: 'swarm@swarm.markets',
  },
]
