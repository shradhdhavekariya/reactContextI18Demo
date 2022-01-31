// eslint-disable-next-line import/no-cycle
import { PoolSubgraph } from './pool.subgraph'
// eslint-disable-next-line import/no-cycle
import { UserSubgraph } from './user.subgraph'

export interface SwapSubgraph {
  id?: string
  caller?: string
  tokenIn?: string
  tokenInSym?: string
  tokenOut?: string
  tokenOutSym?: string
  tokenAmountIn?: string // Big
  tokenAmountOut?: string // Big
  poolAddress?: PoolSubgraph
  userAddress?: UserSubgraph
  value?: string // Big
  feeValue?: string // Big
  poolTotalSwapVolume?: string // Big
  poolTotalSwapFee?: string // Big
  poolLiquidity?: string // Big
  timestamp?: number
}
