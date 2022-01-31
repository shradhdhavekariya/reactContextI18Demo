import { AlertSkeleton } from 'src/components/common/Snackbar/types'
import { AppState, DispatchWithThunk } from 'src/shared/types/state'
import {
  ALERT_EXIT_ANIMATION_DURATION,
  ALERT_AUTO_DISMISS_DELAY,
  DEFAULT_ALERT_OPTIONS,
} from 'src/components/common/Snackbar/consts'

import {
  ALERT_ADDED,
  ALERT_DISMISSED,
  ALERT_REMOVED,
  ALERTS_DISMISSED,
  ALERTS_REMOVED,
} from './action-types'

export const alertRemoved = (key: string) => ({
  type: ALERT_REMOVED,
  payload: {
    key,
  },
})

export const alertDismissed = (key: string) => async (
  dispatch: DispatchWithThunk<AppState>,
) => {
  dispatch({
    type: ALERT_DISMISSED,
    payload: {
      key,
    },
  })

  setTimeout(() => {
    dispatch(alertRemoved(key))
  }, ALERT_EXIT_ANIMATION_DURATION)
}

export const alertAdded = (alert: AlertSkeleton) => async (
  dispatch: DispatchWithThunk<AppState>,
) => {
  const key = alert?.key || Date.now().toString()

  const fullAlert = { ...DEFAULT_ALERT_OPTIONS, ...alert, key }

  dispatch({
    type: ALERT_ADDED,
    payload: {
      alert: fullAlert,
    },
  })

  if (fullAlert.autoDismissible) {
    setTimeout(
      () => {
        dispatch(alertDismissed(key))
      },
      typeof fullAlert.autoDismissible === 'number'
        ? fullAlert.autoDismissible
        : ALERT_AUTO_DISMISS_DELAY,
    )
  }
}

export const alertsRemoved = () => ({
  type: ALERTS_REMOVED,
})

export const alertsCleared = () => async (
  dispatch: DispatchWithThunk<AppState>,
) => {
  dispatch({
    type: ALERTS_DISMISSED,
  })

  setTimeout(() => {
    dispatch(alertsRemoved())
  }, ALERT_EXIT_ANIMATION_DURATION)
}
