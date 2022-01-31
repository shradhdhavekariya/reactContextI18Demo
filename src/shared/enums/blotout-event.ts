export enum BlotoutEvent {
  MM_CONNECT = 'metamask_connect',
  WC_CONNECT = 'walletconnect_connect',
  MM_SIGN_MESSAGE = 'metamask_sign_msg',
  KYC_START = 'kyc_start',
  KYC_VERIFIED = 'kyc_verified',
  EMAIL_VERIFIED = 'email_verified',
  PDF_SIGNED = 'pdf_signed',
  ADDITIONAL_ADDRESS_ADD = 'additional_address_add',
  ADDITIONAL_ADDRESS_REMOVE = 'additional_address_remove',
  REFERENCE_PAYMENT_STATUS = 'reference_payment_status',
  ENABLE_ASSET = 'enable_asset',
  DISABLE_ASSET = 'disable_asset',
  SWAP = 'swap',
  ADD_LIQUIDITY = 'add_liquidity',
  REMOVE_LIQUIDITY = 'remove_liquidity',
  CLAIM_SMT_REWARDS = 'claim_smt_rewards',
  UNWRAP_VSMT = 'unwrap_vsmt',
}
