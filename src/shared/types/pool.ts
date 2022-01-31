import Big from 'big.js'
// eslint-disable-next-line import/no-cycle
import { ExtendedPoolToken, PoolToken } from './tokens'

export interface Share {
  id: string
  poolId?: {
    id: string
  }
  userAddress: {
    id: string
    isCpkId?: boolean
    userAddress?: string
  }
  balance: string
}

export interface Swap {
  feeValue: string
  id: string
  timestamp: number
  tokenAmountIn: string
  tokenAmountOut: string
  tokenIn: string
  tokenInSym: string
  tokenOut: string
  tokenOutSym: string
  value: string
  poolTotalSwapVolume: string
}

export interface Pool {
  id: string
  tokensList: string[]
  tokens: PoolToken[]
  shares: Share[]
  swapFee: string
  totalWeight: string
  totalShares: string
  swaps: Pick<Swap, 'poolTotalSwapVolume'>[]
  totalSwapVolume: string
  liquidity: string
}

export interface PoolExpanded extends Pool {
  crpController: string
  finalized: boolean
  holdersCount: string
  swapsCount: string
  controller: string
  createTime: number
  tx: string
  publicSwap: boolean
  totalSwapFee: string
  tokensList: string[]
  balance?: Big | null
  cpkBalance?: Big | null
  xPoolTokenAddress?: string
  marketCap?: number
  tokens: ExtendedPoolToken[]
}
