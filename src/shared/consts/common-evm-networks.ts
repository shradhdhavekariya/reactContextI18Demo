import { NetworkId } from '../types/config'

export interface EVMNetwork {
  networkId: NetworkId
  chainId: string
  networkName: string
  rpcPrefix: string
  chainName?: string
  nativeCurrency?: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls?: string[]
  blockExplorerUrls?: string[]
}

export const evmNetworkConstantMap = [
  {
    networkId: 1,
    chainId: '0x1',
    networkName: 'Ethereum',
    rpcPrefix: 'mainnet',
    chainName: 'Ethereum Mainnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://etherscan.io/'],
  },
  {
    networkId: 4,
    chainId: '0x4',
    networkName: 'Rinkeby',
    rpcPrefix: 'rinkeby',
    chainName: 'Rinkeby Test Network',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://www.rinkeby.io/'],
    blockExplorerUrls: ['https://rinkeby.etherscan.io/'],
  },
  {
    networkId: 137,
    chainId: '0x89',
    networkName: 'Polygon',
    rpcPrefix: 'polygon-mainnet',
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://polygon-rpc.com/'],
    blockExplorerUrls: ['https://polygonscan.com/'],
  },
  {
    networkId: 80001,
    chainId: '0x13881',
    networkName: 'Mumbai',
    rpcPrefix: 'polygon-mumbai',
    chainName: 'Polygon Testnet Mumbai',
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
    blockExplorerUrls: ['https://polygonscan.com/'],
  },
] as const

export const commonEVMNetworks: EVMNetwork[] = Object.assign(
  evmNetworkConstantMap,
)

export const NetworkMap = new Map<number, EVMNetwork>(
  commonEVMNetworks.map((network) => [network.networkId, network]),
)

export const MAIN_NETWORKS = [1, 137]

export const POLYGON_NETWORK_IDS = [137, 80001]
