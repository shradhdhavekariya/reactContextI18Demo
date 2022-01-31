import {
  ALERTS_DISMISSED,
  ALERTS_REMOVED,
  ALERT_ADDED,
  ALERT_DISMISSED,
  ALERT_REMOVED,
  DISCONNECTED,
} from 'src/state/actions/action-types'
import { Action, Reducer, UI } from 'src/shared/types/state'
import { InitialState } from 'src/state/AppContext'

const uiReducer: Reducer<UI> = (state: UI, action: Action) => {
  switch (action.type) {
    case ALERT_ADDED:
      return {
        alerts: [
          ...state.alerts,
          action.payload && { ...action.payload.alert },
        ],
      }
    case ALERT_DISMISSED: {
      const targetIndex = state.alerts.findIndex(
        (alert) => alert.key === action.payload?.key,
      )

      if (targetIndex !== -1) {
        return {
          alerts: [
            ...state.alerts.slice(0, targetIndex),
            { ...state.alerts[targetIndex], closing: true },
            ...state.alerts.slice(targetIndex + 1),
          ],
        }
      }

      return state
    }
    case ALERT_REMOVED: {
      const targetIndex = state.alerts.findIndex(
        (alert) => alert.key === action.payload?.key,
      )

      if (targetIndex !== -1) {
        return {
          alerts: [
            ...state.alerts.slice(0, targetIndex),
            ...state.alerts.slice(targetIndex + 1),
          ],
        }
      }
      return state
    }
    case ALERTS_DISMISSED: {
      return {
        alerts: state.alerts.map((alert) => ({ ...alert, closing: true })),
      }
    }
    case ALERTS_REMOVED: {
      return { alerts: [] }
    }
    case DISCONNECTED:
      return { ...InitialState.ui, alerts: [...state.alerts] }
    default:
      return state
  }
}

export default uiReducer
