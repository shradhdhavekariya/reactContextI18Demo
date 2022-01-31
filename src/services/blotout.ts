import { capture, EventData, EventOptions } from '@blotoutio/sdk-core'
import { BlotoutEvent, KycProvider } from 'src/shared/enums'
import { capitalize } from 'src/shared/utils/lodash'
import config from 'src/environment'

/**
 * Name for this optional environment variable: REACT_APP_BLOTOUT_DEBUG
 * only if it is set `true` you will able to see the logs
 */
const { debug: DEBUG_BLOTOUT } = config.blotoutPreferences

const captureWithLogs = (
  eventName: string,
  data?: EventData,
  options?: EventOptions,
) => {
  if (DEBUG_BLOTOUT) {
    // eslint-disable-next-line no-console
    console.warn(
      capitalize(eventName.replaceAll('_', ' ')),
      Object.fromEntries(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.entries({ eventName, data, options }).filter(([_, v]) => !!v),
      ),
    )
  }

  return capture(eventName, data, options)
}

const captureSignMessage = (ethAddress: string) =>
  captureWithLogs(BlotoutEvent.MM_SIGN_MESSAGE, { ethAddress })

const captureConnectMM = (autoConnect: boolean) =>
  captureWithLogs(BlotoutEvent.MM_CONNECT, { autoConnect })

const captureConnectWC = () => captureWithLogs(BlotoutEvent.WC_CONNECT)

// TODO: use this method for Yoti
const captureKYCStart = (kycProvider: KycProvider) =>
  captureWithLogs(BlotoutEvent.KYC_START, { kycProvider })

// TODO: not used yet
const captureKYCVerified = (kycProvider: string) =>
  captureWithLogs(BlotoutEvent.KYC_VERIFIED, { kycProvider })

const captureEmailVerified = () => captureWithLogs(BlotoutEvent.EMAIL_VERIFIED)

const capturePDFSigned = () => captureWithLogs(BlotoutEvent.PDF_SIGNED)

const captureAdditionalAddressAdd = (additionalAddress: string) =>
  captureWithLogs(BlotoutEvent.ADDITIONAL_ADDRESS_ADD, { additionalAddress })

const captureAdditionalAddressRemove = (additionalAddress: string) =>
  captureWithLogs(BlotoutEvent.ADDITIONAL_ADDRESS_REMOVE, { additionalAddress })

const capturePaymentDetails = (confirmation: boolean) =>
  captureWithLogs(BlotoutEvent.REFERENCE_PAYMENT_STATUS, { confirmation })

const captureEnableAsset = (assetAddress: string, symbol: string) =>
  captureWithLogs(BlotoutEvent.ENABLE_ASSET, { assetAddress, symbol })

const captureDisableAsset = (assetAddress: string, symbol: string) =>
  captureWithLogs(BlotoutEvent.DISABLE_ASSET, { assetAddress, symbol })

const captureSwap = (
  assetFrom: string,
  assetTo: string,
  valueFrom: number,
  valueTo: number,
) =>
  captureWithLogs(BlotoutEvent.SWAP, { assetFrom, assetTo, valueFrom, valueTo })

const captureAddLiquidity = (
  poolAddress: string,
  multiple: boolean,
  sptAmountOut: string,
  assetValues: Record<string, string | number>,
) =>
  captureWithLogs(BlotoutEvent.ADD_LIQUIDITY, {
    poolAddress,
    multiple,
    sptAmountOut,
    ...assetValues,
  })

const captureRemoveLiquidity = (
  poolAddress: string,
  multiple: boolean,
  sptAmountIn: string,
  assetValues: Record<string, string | number>,
) =>
  captureWithLogs(BlotoutEvent.REMOVE_LIQUIDITY, {
    poolAddress,
    multiple,
    sptAmountIn,
    ...assetValues,
  })

const captureClaimSmtRewards = (amount: number) =>
  captureWithLogs(BlotoutEvent.CLAIM_SMT_REWARDS, { amount })

const captureUnwrapVSmt = (unwrappedAmount: number) =>
  captureWithLogs(BlotoutEvent.UNWRAP_VSMT, { unwrappedAmount })

export default {
  captureSignMessage,
  captureConnectMM,
  captureConnectWC,
  captureKYCStart,
  captureKYCVerified,
  captureEmailVerified,
  capturePDFSigned,
  captureAdditionalAddressAdd,
  captureAdditionalAddressRemove,
  capturePaymentDetails,
  captureEnableAsset,
  captureDisableAsset,
  captureSwap,
  captureAddLiquidity,
  captureRemoveLiquidity,
  captureClaimSmtRewards,
  captureUnwrapVSmt,
}
