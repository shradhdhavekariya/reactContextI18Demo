const yotiEnvNames = Object.freeze([
  'REACT_APP_YOTI_STATUS_URL',
  'REACT_APP_YOTI_SCENARIO_ID',
  'REACT_APP_VOUCHERS_YOTI_SCENARIO_ID',
  'REACT_APP_YOTI_CLIENT_SDK_ID',
])

const blotoutEnvNames = Object.freeze([
  'REACT_APP_BLOTOUT_TOKEN',
  'REACT_APP_BLOTOUT_ENDPOINT_URL',
])

const subgraphEndpointEnvNames = Object.freeze([
  'REACT_APP_GRAPHQL_URL_ETHEREUM',
  'REACT_APP_GRAPHQL_URL_POLYGON',
])

const moonpayWidgetEnvNames = Object.freeze([
  'REACT_APP_MOONPAY_WIDGET_API_KEY',
  'REACT_APP_MOONPAY_WIDGET_BASE_URL',
])

export const envNames = Object.freeze([
  'REACT_APP_INFURA_PROJECT_ID',
  'REACT_APP_API_URL',

  ...subgraphEndpointEnvNames,
  ...moonpayWidgetEnvNames,
  ...blotoutEnvNames,
  ...yotiEnvNames,

  'REACT_APP_DEFAULT_CHAIN_ID',

  'REACT_APP_ZENDESK_KEY',
])
