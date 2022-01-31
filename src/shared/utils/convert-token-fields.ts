import { AbstractToken, PoolToken, NativeToken } from 'src/shared/types/tokens'
import { NATIVE_ETH } from 'src/shared/consts'

export const idToAddress = <T extends NativeToken>(token: T): T =>
  token.address
    ? token
    : {
        ...token,
        address: token.id,
      }

export const idToAddressXToken = <T extends NativeToken>(token: T): T =>
  !token.xToken
    ? token
    : { ...token, xToken: { ...token.xToken, address: token.xToken.id } }

export const fillEtherFields = <T extends Omit<AbstractToken, 'balance'>>(
  token: T,
): T =>
  token.address === NATIVE_ETH.address ? { ...token, ...NATIVE_ETH } : token

export const poolTokenToToken = ({ xToken, balance, ...rest }: PoolToken) =>
  fillEtherFields<PoolToken>({
    ...rest,
    ...xToken?.token,
    poolBalance: Number(balance || 0),
    address: xToken?.token.id || '',
    xToken,
  })
