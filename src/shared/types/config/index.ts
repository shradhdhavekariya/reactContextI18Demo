import { evmNetworkConstantMap } from 'src/shared/consts'
import { IResources } from './resources'

export interface IBlotoutPreferences {
  endpointUrl: string
  token: string
  debug: boolean
}

export interface IYotiConfig {
  scriptStatusUrl: string
  scenarioId: string
  clientSdkId: string
  vouchersScenarioId: string
}
export interface INetworkSpecificAddresses {
  bPoolAddress: string
  bPoolProxyAddress: string
  smtDistributorAddress: string
  vSmtAddress: string
  extraRewardAddress: string
  actionManagerAddress: string
  multicallAddress?: string
}

export interface IContractAddresses extends INetworkSpecificAddresses {
  multicallAddress: string
  vouchersCustodyWalletAddress: string
}

interface IBlockchainConfig {
  apiUrl: string
  rpcUrls: Record<number, string>
  graphqlUrls: { polygon: string; ethereum: string }
  poolsToExclude: string[]
}

export type NetworkId = typeof evmNetworkConstantMap[number]['networkId']

export interface IEnvironment extends IBlockchainConfig {
  blotoutPreferences: IBlotoutPreferences
  defaultChainId: NetworkId
  zendeskEmbedKey: string
  isProduction: () => boolean
  resources: IResources
  rawFeatures: string[]
  secretBranch: string
  supportedChainIds: number[]
  yoti: IYotiConfig
  moonPayApiKey: string
  moonPayBaseURL: string
  sentryDsn: string
  infuraId: string
}
