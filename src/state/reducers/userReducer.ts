import { InitialState } from 'src/state/AppContext'
import {
  LOGIN_FAILED,
  REGISTER_FAILED,
  DOC_SCAN_SESSION_WAITING,
  DOC_SCAN_OUTCOME_REASON,
  SESSION_EXPIRED,
  PROFILE_UPDATED,
  ERROR_OCCURRED,
  DISCONNECTED,
  ACCOUNT_CHANGED,
} from 'src/state/actions/action-types'
import { Action, UserProfile } from 'src/shared/types/state'
import walletAutoDisconnect$ from 'src/shared/observables/walletAutoDisconnect'

const userReducer = (state: UserProfile, action: Action) => {
  switch (action.type) {
    case PROFILE_UPDATED:
      return {
        ...state,
        ...action.payload?.user,
      }
    case REGISTER_FAILED:
    case LOGIN_FAILED:
    case DOC_SCAN_SESSION_WAITING:
      return {
        ...state,
        docScanSessionWaiting: action.payload?.status,
      }
    case DOC_SCAN_OUTCOME_REASON:
      return {
        ...state,
        docScanOutcomeReason: action.payload?.reason,
      }
    case SESSION_EXPIRED:
      return {
        ...state,
        error: action.payload?.error,
      }
    case ERROR_OCCURRED:
      if (action.payload?.error === 'unauthorized') {
        return {
          ...InitialState.user,
        }
      }
      return { ...state }
    case ACCOUNT_CHANGED: {
      if (
        walletAutoDisconnect$.getValue() &&
        !state.accounts.some(
          (account) =>
            account.address.toLowerCase() ===
            action.payload?.account.toLowerCase(),
        )
      ) {
        return {
          ...InitialState.user,
          ...(action.payload?.tier && { tier: action.payload?.tier }),
        }
      }
      return state
    }
    case DISCONNECTED:
      return { ...InitialState.user, tier: state.tier }
    default:
      return { ...state }
  }
}

export default userReducer
