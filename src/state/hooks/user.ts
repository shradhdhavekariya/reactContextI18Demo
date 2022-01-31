import { useMemo } from 'react'
import {
  selectCpkAddress,
  selectIsLoggedIn,
  selectKycProvider,
  selectTier,
  selectUser,
  selectUserAccounts,
  selectUserAddresses,
  selectUserId,
} from '../selectors'
import useSelector from '../useSelector'

export const useTier = () => useSelector(selectTier)

export const useIsLoggedIn = () => useSelector(selectIsLoggedIn)

export const useKycProvider = () => useSelector(selectKycProvider)

export const useCpkAddress = (address?: string | null) =>
  useSelector(useMemo(() => selectCpkAddress(address || ''), [address]))

export const useUserId = () => useSelector(selectUserId)

export const useUser = () => useSelector(selectUser)

export const useUserAccounts = () => useSelector(selectUserAccounts)

export const useUserAddresses = () => useSelector(selectUserAddresses)
