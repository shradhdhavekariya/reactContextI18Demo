import {
  DISCONNECTED,
  ERROR_OCCURRED,
  INITIATED,
} from 'src/state/actions/action-types'
import { combineReducers, InitialState } from 'src/state/AppContext'
import { Action, ErrorState, Reducer } from 'src/shared/types/state'
import uiReducer from './uiReducer'
import userReducer from './userReducer'

const errorReducer: Reducer<ErrorState> = (
  state: ErrorState,
  action: Action,
) => {
  switch (action.type) {
    case ERROR_OCCURRED:
      return {
        error: action.payload?.error,
      }
    case DISCONNECTED:
      return { ...InitialState.errors }
    default:
      return state
  }
}

const initiatedReducer: Reducer<boolean> = (state: boolean, action: Action) => {
  switch (action.type) {
    case INITIATED:
      return true
    default:
      return state
  }
}

export default combineReducers({
  initiated: initiatedReducer,
  ui: uiReducer,
  user: userReducer,
  errors: errorReducer,
})
