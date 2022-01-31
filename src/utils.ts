import Big from 'big.js'
import match from 'conditional-expression'

import { IYotiTokenResponse } from 'src/components/Vouchers/interfaces'
import { JWT, VOUCHERS_YOTI_TOKEN_RESP } from 'src/consts'
import { Tier, VerificationStatus } from 'src/shared/enums'
import { FORBIDDEN_TIERS } from './shared/consts/tiers'
import { PoolToken } from './shared/types/tokens'
import { getNetworkById } from './shared/utils/config'

export const truncateStringInTheMiddle = (
  str: string,
  strLength = 41,
  strPositionStart = 6,
  strPositionEnd = 4,
) => {
  if (str.length > strLength) {
    return `${str.substr(0, strPositionStart)}...${str.substr(
      str.length - strPositionEnd,
      str.length,
    )}`
  }
  return str
}

export const generateEtherscanUrl = ({
  type,
  hash,
  chainId,
}: {
  type: string
  hash?: string
  chainId?: number
}) => {
  if (!hash || !chainId) return ''
  return chainId === 1
    ? `https://etherscan.io/${type}/${hash}`
    : `https://${getNetworkById(chainId)}.etherscan.io/${type}/${hash}`
}

export const getAuthToken = () => localStorage.getItem(JWT)
export const setAuthToken = (token: string) => localStorage.setItem(JWT, token)

export const setVouchersYotiTokenResponse = (resp: IYotiTokenResponse) =>
  localStorage.setItem(VOUCHERS_YOTI_TOKEN_RESP, JSON.stringify(resp))
export const getVouchersYotiTokenResponse = (): IYotiTokenResponse | null =>
  JSON.parse(localStorage.getItem(VOUCHERS_YOTI_TOKEN_RESP) || 'null')

export const getVouchersAuthToken = () => {
  const response = getVouchersYotiTokenResponse()
  return response?.access_token
}

export const removeAuthToken = () => localStorage.removeItem(JWT)
export const removeVouchersAuthToken = () =>
  localStorage.removeItem(VOUCHERS_YOTI_TOKEN_RESP)

export const normalizedPoolTokens = <T extends PoolToken>(tokens: T[]) => {
  const totalWeight = tokens.reduce(
    (acc, token) => acc.add(token.denormWeight || 0),
    new Big(0),
  )

  if (totalWeight.eq(0)) {
    return tokens.map((token) => ({ ...token, weight: new Big(0) }))
  }

  return tokens.map((token) => ({
    ...token,
    weight: new Big(token.denormWeight || 0).times(100).div(totalWeight),
  }))
}

export const arrayWrap = (item: unknown) => {
  if (typeof item === 'undefined' || item === null) {
    return []
  }
  if (Array.isArray(item)) {
    return item
  }
  return [item]
}

export const getVerificationStep = (status: VerificationStatus) =>
  match(status)
    .equals(VerificationStatus.notVerified)
    .then(2)
    .equals(VerificationStatus.addressVerified)
    .then(3)
    .equals(VerificationStatus.kycVerified)
    .then(4)
    .equals(VerificationStatus.tier1Verified)
    .then(5)
    .equals(VerificationStatus.paymentVerified)
    .then(6)
    .equals(VerificationStatus.DocSignVerified)
    .then(7)
    .equals(VerificationStatus.tier2Verified)
    .then(8)
    .else(0)

export const hasCompletedVerification = (target: VerificationStatus) => (
  status: VerificationStatus,
) => {
  const targetStep = getVerificationStep(target)
  const currentStep = getVerificationStep(status)

  return targetStep <= currentStep
}

export const tierAtLeast = (toMatch: Tier) => (candidate: Tier) => {
  if (FORBIDDEN_TIERS.includes(candidate)) {
    return false
  }

  if (toMatch === candidate) {
    return true
  }

  if (toMatch === Tier.tier1) {
    return [Tier.tier1, Tier.tier2].includes(candidate)
  }

  return false
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createMapper = <T extends any>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...mappers: ((item: T) => any)[]
) => (collection: T[]) =>
  mappers.reduce((acc, mapper) => acc.map(mapper), collection)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createFilter = <T extends any>(
  ...filters: ((item: T) => boolean)[]
) => (collection: T[]): T[] =>
  filters.reduce((acc, filter) => acc.filter(filter), collection)

export const propertyNotFalsy = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, any> = Record<string, any>
>(
  property: string,
) => (item: T) => !!item[property]

export const getEnvironment = ():
  | 'local'
  | 'development'
  | 'production'
  | 'deployable' => {
  switch (window.location.hostname) {
    case 'localhost':
      return 'local'
    case 'swarm-markets.netlify.app':
      return 'development'
    case 'trade.swarm.markets':
      return 'production'
    default:
      return 'deployable'
  }
}
