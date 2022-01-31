import {
  IBlotoutPreferences,
  IEnvironment,
  IYotiConfig,
  NetworkId,
} from 'src/shared/types/config'
import {
  generateRpcUrls,
  isMainnet,
  validateEnv,
} from 'src/shared/utils/config'
import resources from './resources'

const windowEnv = window?.ENV || {}
const procEnv = process.env || {}

const uniqKeys = Array.from(
  new Set([...Object.keys(windowEnv), ...Object.keys(procEnv)]),
)

validateEnv(uniqKeys)

const ENV: Record<string, string> = uniqKeys.reduce(
  (map, key) => ({ ...map, [key]: windowEnv?.[key] || procEnv?.[key] }),
  {},
)

const infuraId = ENV?.REACT_APP_INFURA_PROJECT_ID

const defaultChainId = Number(ENV?.REACT_APP_DEFAULT_CHAIN_ID) as NetworkId

const supportedChainIds: NetworkId[] = isMainnet(defaultChainId)
  ? [1, 137]
  : [4, 80001]

const blotoutPreferences: IBlotoutPreferences = Object.freeze({
  token: ENV?.REACT_APP_BLOTOUT_TOKEN,
  endpointUrl: ENV?.REACT_APP_BLOTOUT_ENDPOINT_URL,
  debug: ENV?.REACT_APP_BLOTOUT_DEBUG === 'true',
})

const yoti: IYotiConfig = Object.freeze({
  scriptStatusUrl: ENV?.REACT_APP_YOTI_STATUS_URL || '',
  scenarioId: ENV?.REACT_APP_YOTI_SCENARIO_ID || '',
  clientSdkId: ENV?.REACT_APP_YOTI_CLIENT_SDK_ID || '',
  vouchersScenarioId: ENV?.REACT_APP_VOUCHERS_YOTI_SCENARIO_ID || '',
})

const rpcUrls = Object.freeze(generateRpcUrls(supportedChainIds, infuraId))

const graphqlUrls = Object.freeze({
  ethereum: ENV?.REACT_APP_GRAPHQL_URL_ETHEREUM,
  polygon: ENV?.REACT_APP_GRAPHQL_URL_POLYGON,
})

const config: IEnvironment = Object.freeze({
  blotoutPreferences,
  yoti,
  defaultChainId,
  supportedChainIds,
  rpcUrls,
  graphqlUrls,
  zendeskEmbedKey: ENV?.REACT_APP_ZENDESK_KEY || '',
  apiUrl: ENV?.REACT_APP_API_URL || '',
  poolsToExclude:
    ENV?.REACT_APP_POOLS_TO_EXCLUDE?.toLowerCase()?.split(',') || [],
  isProduction: () =>
    !['localhost', 'netlify'].some((hostPart) =>
      window.location.hostname.includes(hostPart),
    ),
  rawFeatures: ENV?.REACT_APP_RAW_FEATURES?.split(',') || [],
  secretBranch: ENV?.REACT_APP_SECRET_BRANCH_NAME || '',
  resources,
  moonPayApiKey: ENV?.REACT_APP_MOONPAY_WIDGET_API_KEY || '',
  moonPayBaseURL: ENV?.REACT_APP_MOONPAY_WIDGET_BASE_URL || '',
  sentryDsn: ENV?.REACT_APP_SENTRY_DSN || '',
  infuraId,
})

export default config
export * from './contract-addresses'
