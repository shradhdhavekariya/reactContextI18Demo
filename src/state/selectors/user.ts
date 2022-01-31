import { VerificationStatus } from 'src/shared/enums'
import { AppState } from 'src/shared/types/state'
import { hasCompletedVerification } from 'src/utils'
import { propEquals } from 'src/shared/utils/collection/filters'

export const selectTier = (state: AppState) => state.user.tier

export const selectKycProvider = (state: AppState) => state.user.kycProvider

export const selectIsLoggedIn = (state: AppState) =>
  hasCompletedVerification(VerificationStatus.addressVerified)(
    state.user.verificationStatus,
  )

export const selectCpkAddress = (address: string) => (state: AppState) =>
  state.user.accounts.find(propEquals('address', address))?.cpkAddress

export const selectUserId = (state: AppState) => state.user.id

export const selectUser = (state: AppState) => state.user

export const selectUserAccounts = (state: AppState) => state.user.accounts

export const selectUserAddresses = (state: AppState) =>
  state.user.accounts.map((userAccount) => userAccount.address)
