import { AppState, DispatchWithThunk } from 'src/shared/types/state'
import api from 'src/services/api'
import { JWT } from 'src/consts'
import repeat from 'src/shared/utils/repeat'
import { AlertVariant } from 'src/components/common/Snackbar/types'
import BaseResponse from 'src/shared/types/api-responses/base.response'
import { ProfileAttributes } from 'src/shared/types/api-responses/profile.response'
import i18n from 'src/i18n'
import { parseUserData } from './utils'
import { alertAdded } from './snackbar'
import {
  LOGIN_FAILED,
  REGISTER_FAILED,
  ACCEPT_TOS_SUCCESS,
  ACCEPT_TOS_FAILED,
  YES_FLOW_FAILED,
  DOC_SCAN_SESSION_WAITING,
  DOC_SCAN_OUTCOME_REASON,
  SESSION_EXPIRED,
  EMAIL_VERIFIED_FAILED,
  PROFILE_UPDATED,
  YOTI_FLOW_FAILED,
  ACCOUNT_CHANGED,
} from './action-types'

export const profileUpdated = (
  profile: BaseResponse<Partial<ProfileAttributes>>,
) => ({
  type: PROFILE_UPDATED,
  payload: {
    user: {
      ...(profile.attributes.verification_status && {
        verificationStatus: profile.attributes.verification_status,
      }),
      ...(profile.attributes.kyc_status && {
        kycStatus: profile.attributes.kyc_status,
      }),
      ...(profile.attributes.tier && { tier: profile.attributes.tier }),
      id: profile.id,
      ...(profile.attributes.userhash && {
        userHash: profile.attributes.userhash,
      }),
      ...{
        ...(profile.attributes.userdata && {
          ...parseUserData(profile.attributes.userdata),
        }),
      },
      ...(profile.attributes.addresses && {
        accounts: profile.attributes.addresses.map((addressObject) => ({
          address: addressObject.attributes.address.toLowerCase(),
          cpkAddress: addressObject.attributes.cpk_address.toLowerCase(),
          ...(addressObject.attributes.label && {
            label: addressObject.attributes.label,
          }),
        })),
      }),
    },
  },
})

export const accountChanged = (account: string) => async (
  dispatch: DispatchWithThunk<AppState>,
) => {
  let response

  try {
    response = await api.getTier(account)
  } catch {
    // do nothing
  }

  dispatch({
    type: ACCOUNT_CHANGED,
    payload: {
      account,
      ...(response?.attributes.tier && { tier: response.attributes.tier }),
    },
  })
}

// @todo Fix types when possible
export const registrationFailed = (error: unknown) => ({
  type: REGISTER_FAILED,
  payload: {
    error,
  },
})

// @todo Fix types when possible
export const loginFailed = (error: unknown) => ({
  type: LOGIN_FAILED,
  payload: {
    error,
  },
})

export const acceptToSSuccess = () => ({
  type: ACCEPT_TOS_SUCCESS,
})

// @todo Fix types when possible
export const acceptToSFailed = (error: unknown) => ({
  type: ACCEPT_TOS_FAILED,
  payload: {
    error,
  },
})

export const yesFlowFailed = (error: unknown) => ({
  type: YES_FLOW_FAILED,
  payload: {
    error,
  },
})

export const sessionExpired = () => ({
  type: SESSION_EXPIRED,
  payload: {
    error: SESSION_EXPIRED,
  },
})

export const docScanSessionWaitingUpdated = (status: number) => ({
  type: DOC_SCAN_SESSION_WAITING,
  payload: {
    status,
  },
})

export const docScanSessionOutcomeReason = (reason: string) => ({
  type: DOC_SCAN_OUTCOME_REASON,
  payload: {
    reason,
  },
})

export const register = (address: string, signedMessage: string) => async (
  dispatch: DispatchWithThunk<AppState>,
) => {
  try {
    const response = await api.register(address, signedMessage)
    localStorage.setItem(JWT, response.attributes.access_token)
    const profile = await api.profile()

    dispatch(profileUpdated(profile))
  } catch (error) {
    dispatch(registrationFailed(error))
  }
}

export const login = (address: string, signedMessage: string) => async (
  dispatch: DispatchWithThunk<AppState>,
) => {
  try {
    const response = await api.login(address, signedMessage)
    localStorage.setItem(JWT, response.attributes.access_token)
    const profile = await api.profile()

    dispatch(profileUpdated(profile))
    dispatch(
      alertAdded({
        message: 'Ethereum address verified',
        variant: AlertVariant.success,
      }),
    )
  } catch (error) {
    dispatch(loginFailed(error))
  }
}

export const acceptToS = (message: string, signedMessage: string) => async (
  dispatch: DispatchWithThunk<AppState>,
) => {
  try {
    await api.acceptToS(message, signedMessage)

    dispatch(acceptToSSuccess())
  } catch (error) {
    dispatch(acceptToSFailed(error))
  }
}

export const emailVerifiedFailed = (error: unknown) => ({
  type: EMAIL_VERIFIED_FAILED,
  payload: {
    error,
  },
})

export const resendConfirmationEmail = () => async () => {
  await api.resendConfirmationEmail()
}

let yesWindowRef: Window | null

export const initYesFlow = () => async (
  dispatch: DispatchWithThunk<AppState>,
) => {
  try {
    const data = await api.initYesFlow()

    if (!yesWindowRef || yesWindowRef.closed) {
      yesWindowRef = window.open(
        data.attributes.location,
        'Verify using Yes.com',
        'resizable,width=600,height=800',
      )

      await repeat(async (stop) => {
        if (yesWindowRef?.closed) {
          stop()
        }
        try {
          const response = await api.getYesFlowState()
          const { state } = response?.attributes || {}
          if (state === 'authorized') {
            stop()
            yesWindowRef?.close()
            const profile = await api.profile()

            dispatch(profileUpdated(profile))
            await i18n.loadNamespaces('onboarding')

            if (profile.attributes.kyc_status === 'approved') {
              dispatch(
                alertAdded({
                  message: i18n.t(
                    `verifyIdentity.messages.yes.successMessage.message`,
                    { ns: 'onboarding' },
                  ),
                  variant: AlertVariant.success,
                }),
              )
            }

            if (profile.attributes.kyc_status === 'rejected') {
              dispatch(
                alertAdded({
                  message: i18n.t(
                    `verifyIdentity.messages.yes.errorMessage.message`,
                    { ns: 'onboarding' },
                  ),
                  secondaryMessage: i18n.t(
                    `verifyIdentity.messages.yes.errorMessage.secondaryMessage`,
                    { ns: 'onboarding' },
                  ),
                  variant: AlertVariant.error,
                }),
              )
            }
          }
        } catch (e) {
          stop()
          yesWindowRef?.close()
          dispatch(sessionExpired())
        }
      }, 2000)
    } else {
      yesWindowRef.focus()
    }
  } catch (error) {
    dispatch(yesFlowFailed(error))
    dispatch(
      alertAdded({
        message: i18n.t(`verifyIdentity.messages.yes.errorMessage.message`, {
          ns: 'onboarding',
        }),
        secondaryMessage: i18n.t(
          `verifyIdentity.messages.yes.errorMessage.secondaryMessage`,
          { ns: 'onboarding' },
        ),
        variant: AlertVariant.error,
      }),
    )
    const profile = await api.profile()

    dispatch(profileUpdated(profile))
  }
}

export const yotiFlowFailed = () => ({
  type: YOTI_FLOW_FAILED,
})

export const initYotiDocScan = () => async () => {
  const data = await api.getYotiDocScanSession()
  localStorage.setItem('yotiDocScanSessionID', data.id)
  window.location.replace(
    `https://api.yoti.com/idverify/v1/web/index.html?sessionID=${data.id}&sessionToken=${data.attributes.client_session_token}`,
  )
}

export const docScanSessionResults = (sessionID: string) => async (
  dispatch: DispatchWithThunk<AppState>,
) => {
  dispatch(docScanSessionWaitingUpdated(2))
  await repeat(async (stop) => {
    try {
      const data = await api.getDocScanSessionResults(sessionID)
      if (
        data.attributes.status === 'EXPIRED' ||
        (data.attributes.status === 'COMPLETED' &&
          data.attributes.outcome_status === 'rejected')
      ) {
        dispatch(
          docScanSessionOutcomeReason(
            data.attributes.outcome_reason &&
              data.attributes.outcome_reason.length
              ? data.attributes.outcome_reason[0].reason
              : 'DEFAULT',
          ),
        )
        dispatch(
          alertAdded({
            message: 'Verification failed.',
            secondaryMessage:
              'An error happened while trying to verify your Kyc',
            variant: AlertVariant.error,
          }),
        )
        stop()
      } else if (
        data.attributes.status === 'COMPLETED' &&
        data.attributes.outcome_status === 'approved'
      ) {
        dispatch(
          alertAdded({
            message: 'Verification Success.',
            secondaryMessage: 'Your identity has been verified',
            variant: AlertVariant.success,
          }),
        )
        stop()
      }
    } catch (e) {
      stop()
      dispatch(docScanSessionOutcomeReason('DEFAULT'))
      dispatch(
        alertAdded({
          message: 'Verification failed.',
          secondaryMessage: 'An error happened while trying to verify your Kyc',
          variant: AlertVariant.error,
        }),
      )
    }
  }, 5000)
  dispatch(docScanSessionWaitingUpdated(1))

  const profile = await api.profile()
  dispatch(profileUpdated(profile))
}

export const yotiTokenSent = (token: string) => async (
  dispatch: DispatchWithThunk<AppState>,
) => {
  try {
    await api.sendYotiToken(token)
  } catch (error) {
    dispatch(yotiFlowFailed())
    dispatch(
      alertAdded({
        message: 'Verification failed.',
        secondaryMessage:
          'An error happened while trying to verify your identity',
        variant: AlertVariant.error,
      }),
    )
  }

  const profile = await api.profile()

  dispatch(profileUpdated(profile))
}

export const initYesSignDocFlow = (url: string) => async (
  dispatch: DispatchWithThunk<AppState>,
) => {
  try {
    if (!yesWindowRef || yesWindowRef.closed) {
      yesWindowRef = window.open(
        url,
        'Sign ToS using Yes.com',
        'resizable,width=600,height=800',
      )

      await repeat(async (stop) => {
        if (yesWindowRef?.closed) {
          dispatch(
            alertAdded({
              message: 'Signing document failed.',
              secondaryMessage:
                'Signing document not completed because Yes.com window was closed.',
              variant: AlertVariant.error,
            }),
          )
          stop()
        }

        try {
          const response = await api.getYesSignDocFlowState()
          const { state } = response?.attributes || {}
          if (state === 'in_progress') {
            return
          }

          stop()
          yesWindowRef?.close()
          if (state === 'approved') {
            const profile = await api.profile()

            dispatch(profileUpdated(profile))
          } else {
            dispatch(
              alertAdded({
                message: 'Signing document failed.',
                variant: AlertVariant.error,
              }),
            )
          }
        } catch (e) {
          stop()
          yesWindowRef?.close()
          dispatch(sessionExpired())
        }
      }, 1000)
    } else {
      yesWindowRef.focus()
    }
  } catch (error) {
    dispatch(
      alertAdded({
        message: 'Signing document failed.',
        secondaryMessage: 'An error happened while trying to sign the document',
        variant: AlertVariant.error,
      }),
    )

    const profile = await api.profile()

    dispatch(profileUpdated(profile))
  }
}
