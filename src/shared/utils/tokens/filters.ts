import { NATIVE_ETH, VSMT_TOKEN } from 'src/shared/consts'
import { AbstractToken } from 'src/shared/types/tokens'

export const hasAddress = (address: string) => <
  T extends Pick<AbstractToken, 'address'>
>(
  token: T,
) => token.address?.toLowerCase() === address.toLowerCase()

export const addressNot = (address: string) => <T extends AbstractToken>(
  token: T,
) => token.address.toLowerCase() !== address.toLowerCase()

export const isEth = hasAddress(NATIVE_ETH.address)

export const isNotEth = addressNot(NATIVE_ETH.address)

export const isVSMT = hasAddress(VSMT_TOKEN.address)
