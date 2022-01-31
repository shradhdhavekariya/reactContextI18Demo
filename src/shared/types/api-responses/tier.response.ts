import { Tier } from 'src/shared/enums'
import BaseResponse from './base.response'

interface TierAttributes {
  tier: Tier
}

type TierResponse = BaseResponse<TierAttributes>

export default TierResponse
