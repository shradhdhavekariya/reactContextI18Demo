/* eslint-disable @typescript-eslint/naming-convention */
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components'
import Zendesk from 'react-zendesk'
import {
  createMuiTheme,
  ThemeProvider as MaterialUIThemeProvider,
} from '@material-ui/core/styles'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { ApolloProvider } from '@apollo/client'
import { QueryParamProvider } from 'use-query-params'
import theme, { zendeskStyle } from 'src/theme'
import 'src/App.css'
import useAsyncReducer from 'src/hooks/useAsyncReducer'
import { InitialState, AppContext } from 'src/state/AppContext'
import { AppState } from 'src/shared/types/state'
import Homepage from 'src/pages/Homepage'
import Onboarding from 'src/pages/Onboarding'
import Swap from 'src/pages/Swap'
import Pools from 'src/pages/Pools'
import Wallet from 'src/pages/Wallet'
import Passport from 'src/pages/Passport'
import TestnetFaucet from './pages/TestnetFaucet'
import Vouchers from './pages/Vouchers'
import { SnackbarProvider } from './components/common/Snackbar'
import appReducer from './state/reducers'
import { init } from './state/actions/app'
import EmailVerificationLandingPage from './components/Onboarding/EmailVerificationLandingPage'
import client from './apollo'
import { RequestCacheProvider } from './cache/request-cache'
import store from './store'
import SinglePool from './pages/SinglePool'
import { useAccount } from './shared/web3'
import config from './environment'

const { zendeskEmbedKey, isProduction } = config
let initiated = false

function App() {
  const [appState, dispatch] = useAsyncReducer<AppState>(
    appReducer,
    InitialState,
  )

  if (!store.isReady) {
    store.isReady = true
    store.dispatch = (value) => dispatch(value)
    Object.freeze(store)
  }

  const account = useAccount()

  useEffect(() => {
    if (!initiated) {
      dispatch(init())

      initiated = true
    }
  }, [account, appState.user.id, dispatch])

  return (
    <AppContext.Provider value={{ appState, dispatch }}>
      <ApolloProvider client={client}>
        <RequestCacheProvider>
          <MaterialUIThemeProvider
            theme={createMuiTheme({
              ...theme,
              breakpoints: {
                values: {
                  xs: 0,
                  sm: 640,
                  md: 832,
                  lg: 1024,
                  xl: 1920,
                },
              },
            })}
          >
            <StyledComponentsThemeProvider theme={theme}>
              <SnackbarProvider>
                <Router>
                  <QueryParamProvider ReactRouterRoute={Route}>
                    <Route exact path="/" component={Homepage} />
                    <Route
                      exact
                      path="/verify-email"
                      component={EmailVerificationLandingPage}
                    />
                    <Route exact path="/onboarding" component={Onboarding} />
                    <Route exact path="/swap" component={Swap} />
                    <Route exact path="/pools/:category?" component={Pools} />
                    <Route exact path="/pool/:address" component={SinglePool} />
                    <Route exact path="/wallet" component={Wallet} />
                    <Route exact path="/passport" component={Passport} />
                    {!isProduction() && (
                      <Route exact path="/faucet" component={TestnetFaucet} />
                    )}
                    <Route path="/vouchers" component={Vouchers} />
                  </QueryParamProvider>
                </Router>
              </SnackbarProvider>
            </StyledComponentsThemeProvider>
          </MaterialUIThemeProvider>
        </RequestCacheProvider>
      </ApolloProvider>
      <Zendesk defer zendeskKey={zendeskEmbedKey} {...zendeskStyle} />
    </AppContext.Provider>
  )
}

export default App
