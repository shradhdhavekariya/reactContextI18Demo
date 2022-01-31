import BaseResponse from './base.response'

interface MaticFaucetAttributes {
  tx_hash: string
}

type MaticFaucetResponse = BaseResponse<MaticFaucetAttributes>

export default MaticFaucetResponse
