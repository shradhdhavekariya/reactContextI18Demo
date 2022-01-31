// eslint-disable-next-line import/no-cycle
import { PoolSubgraph } from './pool.subgraph'
// eslint-disable-next-line import/no-cycle
import { UserSubgraph } from './user.subgraph'

type SwapTypeSubgraph =
  | 'swapExactAmountIn'
  | 'swapExactAmountOut'
  | 'joinswapExternAmountIn'
  | 'joinswapPoolAmountOut'
  | 'exitswapPoolAmountIn'
  | 'exitswapExternAmountOut'

export interface TransactionSubgraph {
  id?: string
  tx?: string
  event?: string
  block?: number
  timestamp?: number
  gasUsed?: string // Big
  gasPrice?: string // Big
  sender?: string
  poolAddress?: PoolSubgraph
  userAddress?: UserSubgraph
  action?: SwapTypeSubgraph
}
