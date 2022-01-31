import {
  KycStatus,
  VerificationStatus,
  KycProvider,
  Tier,
} from 'src/shared/enums'
import UserAccount from './user-account'

interface UserProfile {
  verificationStatus: VerificationStatus
  kycStatus: KycStatus
  kycProvider: KycProvider
  tier: Tier
  email: string
  userHash: string
  error?: unknown
  id: string | null
  birthDate?: string
  firstName?: string
  givenName?: string
  fullName?: string
  familyName?: string
  iban?: string
  address?: string[]
  structuredAddress?: Record<string, string>
  placeOfBirth?: string
  nationalities?: string[]
  accounts: UserAccount[]
  usdBalance: {
    nativeTokens: number
    poolTokens: number
  }
  docScanSessionWaiting?: number
  docScanOutcomeReason: string
}

export default UserProfile
