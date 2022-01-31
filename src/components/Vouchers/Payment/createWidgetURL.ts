import queryString from 'query-string'

import config from 'src/environment'
import { getCurrentConfig } from 'src/shared/observables/configForNetwork'
import api from 'src/services/api'

const defaultConfig = {
  apiKey: config.moonPayApiKey,
  enabledPaymentMethods: [
    'credit_debit_card',
    'apple_pay',
    'google_pay',
    'samsung_pay',
    'sepa_bank_transfer',
    'gbp_bank_transfer',
    'gbp_open_banking_payment',
  ].join(','),
  colorCode: '#0179ef',
  language: 'en',
  kycAvailable: true,
  showAllCurrencies: false,
  walletAddress: getCurrentConfig().vouchersCustodyWalletAddress,
  lockAmount: true,
}

const createWidgetURL = async (
  externalTransactionId: string,
  email: string,
  externalCustomerId: string,
  currencyCode: string,
  baseCurrencyAmount: number,
  baseCurrencyCode: string,
): Promise<string> => {
  const widgetConfig = {
    ...defaultConfig,
    email,
    externalCustomerId,
    baseCurrencyAmount,
    baseCurrencyCode,
    currencyCode,
    externalTransactionId,
  }

  const widgetQueryString = queryString.stringify(widgetConfig)
  const widgetURL = `${config.moonPayBaseURL}/?${widgetQueryString}`
  const response = await api.signMoonpayURL(widgetURL)

  return response.signedURL
}

export default createWidgetURL
