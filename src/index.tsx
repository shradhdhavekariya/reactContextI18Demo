import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import ReactDOM from 'react-dom'
import { init } from '@blotoutio/sdk-core'
import './i18n'
import App from './App'
import config from './environment'
import { getEnvironment } from './utils'
import { getNetworkById } from './shared/utils/config'
import packageJSON from '../package.json'
import { networkId$ } from './shared/web3'

const { blotoutPreferences } = config

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/,
    ),
)

if (!isLocalhost && blotoutPreferences.endpointUrl) {
  // The init method is used for initializing Blotout SDK.
  // This sets all required configurations and also sends system event sdk_start which allows it to record user.
  init(blotoutPreferences)
}

if (!isLocalhost) {
  Sentry.init({
    release: `${packageJSON.name}@${packageJSON.version}`,
    dsn: config.sentryDsn,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 0.25,
    environment: getEnvironment(),
  })
  Sentry.setContext('network', {
    chainId: config.defaultChainId,
    name: getNetworkById(config.defaultChainId),
  })

  networkId$.subscribe((networkId) => {
    Sentry.setContext('network', {
      chainId: networkId,
      name: getNetworkById(networkId),
    })
  })
}

ReactDOM.render(<App />, document.getElementById('root'))
