import React, { createContext, useContext } from 'react'
import {
  Action,
  AppState,
  ContextType,
  DispatchWithThunk,
  Reducer,
} from 'src/shared/types/state'
import {
  KycStatus,
  VerificationStatus,
  KycProvider,
  Tier,
} from 'src/shared/enums'

export const InitialState: AppState = {
  initiated: false,
  user: {
    verificationStatus: VerificationStatus.notVerified,
    kycStatus: KycStatus.notStarted,
    kycProvider: KycProvider.notVerified,
    tier: Tier.tier0,
    email: '',
    userHash: '',
    error: null,
    id: null,
    accounts: [],
    usdBalance: {
      nativeTokens: 0,
      poolTokens: 0,
    },
    docScanSessionWaiting: 0,
    docScanOutcomeReason: '',
  },
  ui: {
    alerts: [],
  },
  errors: {
    error: null,
  },
}

export const AppContext = createContext<ContextType<AppState>>({
  appState: InitialState,
  dispatch: () => {},
})

export function connect<
  T,
  S extends Record<string, unknown> = Record<string, unknown>,
  D extends Record<string, unknown> = Record<string, unknown>
>(
  mapStateToProps: null | ((state: AppState, props: T) => S),
  mapDispatchToProps?: (
    dispatch: DispatchWithThunk<AppState>,
    props: T & S,
  ) => D | undefined,
) {
  // eslint-disable-next-line
  return (WrappedComponent: React.FC<any>) =>
    function ConnectedComponent(props: T) {
      const { appState: state, dispatch } = useContext(AppContext)

      const propsWithStateDerived = {
        ...props,
        ...mapStateToProps?.(state, props),
      }

      const allProps = {
        ...propsWithStateDerived,
        ...mapDispatchToProps?.(dispatch, propsWithStateDerived as T & S),
      }

      return <WrappedComponent {...allProps} />
    }
}

export const combineReducers = (
  reducers: { [k in keyof AppState]: Reducer<AppState[k]> },
): Reducer<AppState> => (state: AppState, action: Action) => {
  const newState = (Object.keys(reducers) as Array<keyof AppState>).reduce(
    (accumulator, key) => ({
      ...accumulator,
      [key]: reducers[key]?.(state[key] as never, action),
    }),
    {} as AppState,
  )

  return newState
}
