import React, { createContext, useContext, useEffect } from 'react'
import styled from 'styled-components'
import {
  alertAdded,
  alertsCleared,
  alertDismissed,
  alertRemoved,
} from 'src/state/actions/snackbar'
import { connect } from 'src/state/AppContext'
import { AppState, DispatchWithThunk } from 'src/shared/types/state'
import { getErrorDetails } from 'src/services/error-handler/helpers'
import { ErrorDetails } from 'src/services/error-handler'
import { Alert, AlertOptions, AlertSkeleton, AlertVariant } from './types'
import AnimationWrapper from './AnimationWrapper'
import ToastMessage from './ToastMessage'

const SnackbarContext = createContext<{
  addAlert: (message: React.ReactNode, options?: AlertOptions) => void
  dismissAlert: (key: string) => void
  clearAlerts: () => void
  addError: (e: Error, fallback?: ErrorDetails) => void
}>({
  addAlert: () => {},
  dismissAlert: () => {},
  clearAlerts: () => {},
  addError: () => {},
})

const Snackbar = styled.div`
  position: fixed;
  bottom: 16px;
  left: 16px;
  right: 16px;
  z-index: ${(props) => props.theme.zIndices[5]};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  @media (min-width: ${({ theme }) => theme.breakpoints[1]}) {
    left: 50%;
    transform: translateX(-50%);
    right: unset;
  }
`

interface SnackbarProviderProps {
  children: React.ReactNode
}

interface SnackBarStateProps extends Record<string, unknown> {
  alerts: Alert[]
}

interface SnackBarActions extends Record<string, unknown> {
  addAlert: (message: React.ReactNode, options?: AlertOptions) => void
  dismissAlert: (key: string) => void
  clearAlerts: () => void
}

const SnackbarProvider = ({
  children,
  alerts,
  addAlert,
  dismissAlert,
  clearAlerts,
}: SnackbarProviderProps & SnackBarStateProps & SnackBarActions) => {
  useEffect(() => {
    const rawFlashMessages = localStorage.getItem('FLASH')

    if (rawFlashMessages) {
      try {
        const parsedMessages = JSON.parse(rawFlashMessages || '[]')

        parsedMessages.forEach(({ message, ...options }: AlertSkeleton) =>
          addAlert(message, options),
        )
      } finally {
        localStorage.removeItem('FLASH')
      }
    }
  }, [addAlert])

  const addError = (e: Error, fallback?: ErrorDetails) => {
    const {
      description,
      actionText,
      actionHref,
      autoDismissible,
      actionHrefOpenInSameTab,
    } = getErrorDetails(e, fallback)

    addAlert(description, {
      variant: AlertVariant.error,
      actionText,
      actionHref,
      autoDismissible,
      actionHrefOpenInSameTab,
    })
  }

  return (
    <SnackbarContext.Provider
      value={{
        addAlert,
        dismissAlert,
        clearAlerts,
        addError,
      }}
    >
      {children}
      <Snackbar>
        {alerts.map((alert) => (
          <AnimationWrapper key={`snackbar-${alert.key}`} out={alert.closing}>
            {(className: string) => (
              <ToastMessage
                {...alert}
                onClose={() => dismissAlert(alert.key)}
                className={className}
              />
            )}
          </AnimationWrapper>
        ))}
      </Snackbar>
    </SnackbarContext.Provider>
  )
}

const mapStateToProps = ({ ui: { alerts } }: AppState) => ({
  alerts,
})

const mapDispatchToProps = (dispatch: DispatchWithThunk<AppState>) => ({
  addAlert: (message: React.ReactNode, options?: AlertOptions) =>
    dispatch(alertAdded({ message, ...options })),
  dismissAlert: (key: string) => dispatch(alertDismissed(key)),
  remove: (key: string) => dispatch(alertRemoved(key)),
  clearAlerts: () => dispatch(alertsCleared()),
})

const ConnectedSnackbar = connect<
  SnackbarProviderProps,
  SnackBarStateProps,
  SnackBarActions
>(
  mapStateToProps,
  mapDispatchToProps,
)(SnackbarProvider)

const useSnackbar = () => {
  const context = useContext(SnackbarContext)
  if (!context) {
    throw new Error('useSnackbar should be inside SnackbarProvider')
  }
  return context
}

const addFlashAlert = (message: string, options?: AlertOptions): void => {
  const rawMessages = localStorage.getItem('FLASH')
  const parsedMessages = JSON.parse(rawMessages || '[]')

  localStorage.setItem(
    'FLASH',
    JSON.stringify([...parsedMessages, { message, ...options }]),
  )
}

export { ConnectedSnackbar as SnackbarProvider, useSnackbar, addFlashAlert }
