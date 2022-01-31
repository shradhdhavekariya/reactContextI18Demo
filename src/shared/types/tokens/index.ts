import Big from 'big.js'
// eslint-disable-next-line import/no-cycle
import { Erc20 } from 'src/contracts/ERC20'
import { AllowanceStatus } from 'src/shared/enums'
// eslint-disable-next-line import/no-cycle
import { PoolExpanded } from '../pool'

interface HasBalance {
  balance?: Big | null
}

interface HasAllowance {
  cpkAllowance?: Big | null
}

type AbstractToken = {
  id: string
  address: string
  name: string
  symbol: string
  decimals: number
} & HasBalance

interface NativeToken extends AbstractToken {
  id: string
  xToken?: XToken
}

type AssetToken = NativeToken & {
  allowanceStatus: AllowanceStatus
  exchangeRate: number
} & HasAllowance

interface XToken extends Omit<AbstractToken, 'balance'> {
  id: string
  paused: boolean
  token: AbstractToken & { id: string }
  poolTokens?: PoolToken[]
  cpkBalance?: Big | null
}

interface PoolToken extends NativeToken {
  poolId: Partial<PoolExpanded>
  denormWeight: string
  exchangeRate?: number | null
  poolBalance?: number
  weight?: number
  usdBalance?: number
  cpkBalance?: Big | null
}

interface ProxyToken extends NativeToken {
  cpkXTokenBalance?: Big | null
  cpkXTokenUsdBalance: number
}

type ExtendedPoolToken = PoolToken & {
  contract?: Erc20
  poolBalance?: number
} & HasAllowance

export type Token = {
  address: string
  name: string
  symbol: string
  decimals: number
  balance?: Big | null
  cpkBalance?: Big | null
  denormWeight?: string
  exchangeRate?: number | null
} & HasBalance

interface PoolTokenInfo
  extends Pick<PoolToken, 'address' | 'name' | 'symbol' | 'poolBalance'> {
  weight: number
  userBalance: number
  userAssetValue: number
}

export interface PoolAssetToken {
  weight: number
  percent: number
  amount: number
  price: number
  totalValue: number
  selectedAssetId: string
}

export type {
  HasBalance,
  HasAllowance,
  AssetToken,
  XToken,
  AbstractToken,
  PoolToken,
  ProxyToken,
  NativeToken,
  PoolTokenInfo,
  ExtendedPoolToken,
}
