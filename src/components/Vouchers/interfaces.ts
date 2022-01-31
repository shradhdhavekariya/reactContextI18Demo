export interface IVoucherFormState {
  voucherValue: number
  cryptoBase: string
  cryptoAmount: number
  fiat: string
  transactionId: string
}

export interface IVoucherResponse {
  id: string
  attributes: {
    remember_me_id: string
    created_at: string
    status: 'pending' | 'approved' | 'rejected' | 'redeem_pending' | 'redeemed'
    value: {
      amount: number
      currency: string
      payment_amount: number
      payment_currency: string
    }
    background: {
      url?: string
      color_hex?: string
    }
  }
}

export interface IYotiTokenResponse {
  name: string
  access_token: string
  email: string
  created_at: string
  status: string
  remember_me_id: string
}
