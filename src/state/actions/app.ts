import api from 'src/services/api'
import { loadFromStorage, removeFromStorage } from 'src/services/local-storage'
import walletAutoDisconnect$ from 'src/shared/observables/walletAutoDisconnect'
import { AppState, DispatchWithThunk } from 'src/shared/types/state'
import {
  getAccount,
  setReady,
  CACHED_WALLET_KEY,
  connectWallet,
} from 'src/shared/web3'
import { getAuthToken } from 'src/utils'
import { DISCONNECTED, ERROR_OCCURRED, INITIATED } from './action-types'
import { profileUpdated } from './users'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const errorOccurred = (error: any) => ({
  type: ERROR_OCCURRED,
  payload: {
    error,
  },
})

export const disconnected = () => ({
  type: DISCONNECTED,
})

export const initiated = () => ({
  type: INITIATED,
})

export const init = () => async (dispatch: DispatchWithThunk<AppState>) => {
  const lastWallet = loadFromStorage<string>(CACHED_WALLET_KEY)

  if (lastWallet) {
    const success = await connectWallet(lastWallet)

    if (!success) {
      removeFromStorage(CACHED_WALLET_KEY)
    }
  }

  const account = getAccount()

  if (!account) {
    if (walletAutoDisconnect$.getValue()) {
      dispatch(disconnected())
      dispatch(initiated())
    }
    setReady()

    return
  }

  const updateTier = async () => {
    let response

    try {
      response = await api.getTier(account)
    } catch {
      // do nothing
    }

    if (response) {
      dispatch(profileUpdated(response))
    }
  }

  const token = getAuthToken()

  if (!token) {
    dispatch(disconnected())
    await updateTier()
    dispatch(initiated())
    setReady()
    return
  }

  let profile
  try {
    profile = await api.profile()
  } catch (e) {
    dispatch(disconnected())
  }

  if (profile) {
    const userMatchesWallet = profile?.attributes?.addresses.some(
      (user) => user.attributes.address.toLowerCase() === account.toLowerCase(),
    )
    if (userMatchesWallet) {
      dispatch(profileUpdated(profile))
    } else {
      dispatch(disconnected())
      await updateTier()
    }
  } else {
    await updateTier()
  }

  dispatch(initiated())

  setReady()
}
