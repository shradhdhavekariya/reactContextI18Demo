import { Dispatch } from 'react'
import AppState from './app-state'
import ErrorState from './error-state'
import Action from './action'
import UserProfile from './user-profile'
import UI from './ui'

type ReducerType = (arg0: AppState | undefined, arg1: Action) => AppState

type Thunk<T> = (dispatch: Dispatch<Action | Thunk<T>>) => Promise<void>

type DispatchWithThunk<T> = Dispatch<Action | Thunk<T>>

type Reducer<T> = (state: T, action: Action) => T

type Selector<T> = (state: AppState) => T

interface ContextType<T> {
  appState: AppState
  dispatch: Dispatch<Action | Thunk<T>>
}

interface IStore {
  isReady: boolean
  dispatch: (value: Action | Thunk<AppState>) => void
}

export type {
  Action,
  AppState,
  ContextType,
  DispatchWithThunk,
  ErrorState,
  IStore,
  Reducer,
  ReducerType,
  Thunk,
  UI,
  UserProfile,
  Selector,
}
