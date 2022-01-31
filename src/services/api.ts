import capitalize from 'lodash/capitalize'
import {
  getAuthToken,
  getVouchersAuthToken,
  removeAuthToken,
  removeVouchersAuthToken,
} from 'src/utils'
import {
  ExchangePricesResponse,
  ExchangePriceResponseV2,
  ProfileResponse,
} from 'src/shared/types/api-responses'
import ToSResponse from 'src/shared/types/api-responses/tos.response'
import config from 'src/environment'
import TierResponse from 'src/shared/types/api-responses/tier.response'
import MaticFaucetResponse from 'src/shared/types/api-responses/matic-faucet.response'
import { isErrorResponse } from 'src/shared/utils/response'
import { KnownError } from './error-handler/types'

interface IRequestInit extends RequestInit {
  shouldNotReturnDataProperty?: boolean
}

export const request = async (endpoint: string, options?: IRequestInit) => {
  const response = await fetch(`${config.apiUrl}${endpoint}`, options)

  let json

  try {
    json = await response.clone().json()
  } catch {
    json = response.text()
  }

  if (response.ok) {
    if (options?.shouldNotReturnDataProperty) {
      return json
    }
    return json.data
  }

  if (response.status === 401) {
    removeAuthToken()
    removeVouchersAuthToken()
    throw new Error('unauthorized')
  } else if (isErrorResponse(json)) {
    const firstError = json.errors[0]
    throw new KnownError(capitalize(firstError.detail), {
      code: Number(firstError.status),
      name: firstError.code,
      type: firstError.title,
    })
  } else {
    throw new Error(response.statusText)
  }

  return null
}

export const get = async (endpoint: string, options?: IRequestInit) =>
  request(endpoint, {
    ...options,
    method: 'GET',
  })

export const post = async (endpoint: string, options?: IRequestInit) =>
  request(endpoint, {
    ...options,
    method: 'POST',
  })

const patch = async (endpoint: string, options?: IRequestInit) =>
  request(endpoint, {
    ...options,
    method: 'PATCH',
  })

const del = async (endpoint: string, options?: IRequestInit) =>
  request(endpoint, {
    ...options,
    method: 'DELETE',
  })

const getTier = async (address: string): Promise<TierResponse> =>
  get(`addresses/${address}/tier`)

const checkExistence = async (address: string): Promise<boolean> => {
  try {
    await get(`addresses/${address}`)
    return true
  } catch {
    return false
  }
}

const profile = async (): Promise<ProfileResponse> =>
  get(`profile`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })

const acceptToS = async (message: string, signedMessage: string) => {
  // @todo: replace id with valid Hash of the terms of service doc
  const body = JSON.stringify({
    data: {
      id: message,
      type: 'terms',
      attributes: {
        signature: signedMessage,
      },
    },
  })
  const data = await post(`terms/accept`, {
    body,
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })

  return data
}

const nonceMessage = async (address: string, terms_hash?: string) => {
  const body = JSON.stringify({
    data: {
      type: 'auth_nonce_request',
      attributes: {
        address,
        terms_hash,
      },
    },
  })
  const data = await post(`nonce`, {
    body,
  })

  return data
}

const register = async (address: string, signedMessage: string) => {
  const body = JSON.stringify({
    data: {
      type: 'register',
      attributes: {
        auth_pair: {
          address,
          signed_message: signedMessage,
        },
      },
    },
  })
  const data = await post(`register`, {
    body,
  })

  return data
}

const login = async (address: string, signedMessage: string) => {
  const body = JSON.stringify({
    data: {
      type: 'login_request',
      attributes: {
        auth_pair: {
          address,
          signed_message: signedMessage,
        },
      },
    },
  })
  const data = await post(`login`, {
    body,
  })

  return data
}

const location = async () => {
  const data = await get(`location`)

  return data
}

const initYesFlow = async () => {
  const data = await get(`yes/init_yes_flow`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
    credentials: 'include',
  })

  return data
}

const getYesFlowState = async () => {
  const data = await get(`yes/flowstate`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })

  return data
}

const resendConfirmationEmail = async () =>
  post(`email_verification/resend`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })

const getVerificationCode = async (email: string) =>
  get(`dev/email_code?email=${email}`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })

const verifyEmail = async (email: string, code: string) => {
  const body = JSON.stringify({
    data: {
      type: 'verify_email_request',
      attributes: {
        email,
        code,
      },
    },
  })

  await post(`email_verification/verify`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body,
  })
}

const verifyDocscanEmail = async (email: string) => {
  const body = JSON.stringify({
    data: {
      type: 'docscan_update_email',
      attributes: {
        email,
      },
    },
  })

  await post(`yoti/docscan/update_email`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body,
  })
}

const getYotiDocScanSession = async () =>
  get(`yoti/docscan`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })

const getDocScanSessionResults = async (sessionID: string) =>
  get(`yoti/docscan/sessions/${sessionID}`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })

const sendYotiToken = async (token: string) =>
  get(`yoti/tokencb?token=${token}`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })

const getPaymentInfo = async () =>
  get(`payment_info`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })

const updatePaymentInfo = async (paymentSent = true) =>
  patch('payment_info', {
    body: JSON.stringify({
      data: {
        id: '',
        type: 'update_payment_status',
        attributes: {
          status: paymentSent ? 'sent' : 'not_sent',
        },
      },
    }),
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })

const addAddress = async (address: string, signedMessage: string) =>
  post('addresses', {
    body: JSON.stringify({
      data: {
        id: '',
        type: 'add_address',
        attributes: {
          auth_pair: {
            address,
            signed_message: signedMessage,
          },
        },
      },
    }),
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })

const deleteAddress = async (address: string) =>
  del(`addresses/${address}`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })

// ##Deprecated, soon will be removed
const getPrices = async (
  tokens: string[],
  counter = 'USD',
): Promise<ExchangePricesResponse[]> =>
  get(`quotes?base=${tokens.join(',')}&counter=${counter}`)

const getPricesV2 = async (
  addresses: string[],
  currencies: string[] = ['usd'],
): Promise<ExchangePriceResponseV2> =>
  get(
    `exchange_prices?contract_addresses=${addresses.join(
      ',',
    )}&vs_currencies=${currencies.join(',')}`,
  )

const getToS = async (): Promise<ToSResponse> =>
  get('yes/init_sign_flow', {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
    credentials: 'include',
  })

const getSignedDocInfo = async () =>
  get('yes/signed_doc', {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
    credentials: 'include',
  })

const getYesSignDocFlowState = async () =>
  get(`yes/docsign_flowstate`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })

const sendVouchersYotiToken = async (token: string) =>
  post('quickbuy/yoti_token', { body: JSON.stringify({ token }) })

const getVouchersList = () =>
  get('quickbuy/profile/vouchers', {
    headers: {
      Authorization: `Bearer ${getVouchersAuthToken()}`,
    },
  })

const getMostRecentlyCreatedVoucher = () =>
  get('quickbuy/profile/vouchers?page[limit]=1', {
    headers: {
      Authorization: `Bearer ${getVouchersAuthToken()}`,
    },
  })

const getMoonPayTransactionStatus = (transactionId: string) =>
  get(`quickbuy/moonpay/transaction_update/${transactionId}`)

const getVouchers = () =>
  get('profile/vouchers', {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })

const updateVouchersVoucherBackground = (
  voucherId: string,
  imageURL: string,
) => {
  const requestBody = {
    data: {
      id: voucherId,
      type: 'quickbuy_voucher_update',
      attributes: {
        background: {
          url: imageURL,
        },
      },
    },
  }

  return patch(`quickbuy/vouchers/${voucherId}`, {
    headers: {
      Authorization: `Bearer ${getVouchersAuthToken()}`,
    },
    body: JSON.stringify(requestBody),
  })
}

const redeemVoucher = (voucherId: string) =>
  post(`quickbuy/vouchers/${voucherId}/redeem`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })

const signMoonpayURL = (url: string) =>
  post(`quickbuy/payment/sign_url`, {
    body: JSON.stringify({ url }),
    shouldNotReturnDataProperty: true,
  })

const getTotalVouchersValue = (currency: string): Promise<number> =>
  get(`quickbuy/profile/vouchers/value?currency=${currency}`, {
    headers: {
      Authorization: `Bearer ${getVouchersAuthToken()}`,
    },
    shouldNotReturnDataProperty: true,
  }).then((data) => data.value)

const addLog = (userId: string) => {
  const requestBody = {
    data: {
      type: 'add_log',
      attributes: {
        user_id: parseInt(userId, 10),
        log_notes: {
          type: 'agreeTerms',
          attributes: {
            created: new Date().toISOString(),
          },
        },
      },
    },
  }

  return post('logs', {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(requestBody),
  })
}

const getSMTSupply = () =>
  get('smt_supply', {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })

const updateAddressLabel = async (
  address: string,
  label: string,
): Promise<boolean> => {
  const requestBody = {
    data: {
      type: 'address_label',
      attributes: {
        label,
      },
    },
  }
  return post(`addresses/${address}/label`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(requestBody),
  })
}

const requestMaticFromFaucet = (
  address: string,
): Promise<MaticFaucetResponse> =>
  get(`addresses/${address}/faucet/matic`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })

export default {
  addLog,
  get,
  getTier,
  checkExistence,
  getPrices,
  getPricesV2,
  nonceMessage,
  register,
  login,
  profile,
  acceptToS,
  location,
  initYesFlow,
  getYesFlowState,
  resendConfirmationEmail,
  getVerificationCode,
  verifyEmail,
  verifyDocscanEmail,
  getYotiDocScanSession,
  getDocScanSessionResults,
  sendYotiToken,
  getPaymentInfo,
  updatePaymentInfo,
  addAddress,
  deleteAddress,
  getToS,
  getSignedDocInfo,
  getYesSignDocFlowState,
  sendVouchersYotiToken,
  getVouchersList,
  updateVouchersVoucherBackground,
  getVouchers,
  redeemVoucher,
  getSMTSupply,
  signMoonpayURL,
  getTotalVouchersValue,
  getMostRecentlyCreatedVoucher,
  getMoonPayTransactionStatus,
  updateAddressLabel,
  requestMaticFromFaucet,
}
