import { KycStatus, Tier, VerificationStatus } from 'src/shared/enums'
import BaseResponse from './base.response'
import UserData from './user-data'

export interface ProfileAttributes {
  kyc_status: KycStatus
  verification_status: VerificationStatus
  userdata?: UserData
  addresses: {
    attributes: {
      label: string
      address: string
      cpk_address: string
    }
  }[]
  tier: Tier
  userhash: string
}

type ProfileResponse = BaseResponse<ProfileAttributes>

export default ProfileResponse
