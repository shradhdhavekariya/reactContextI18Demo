// eslint-disable-next-line import/no-cycle
import { PoolTokenSubgraph } from './pool-token.subgraph'
// eslint-disable-next-line import/no-cycle
import { PoolShareSubgraph } from './pool-share.subgraph'
// eslint-disable-next-line import/no-cycle
import { SwapSubgraph } from './swap.subgraph'
// eslint-disable-next-line import/no-cycle
import { BalancerSubgraph } from './balancer.subgraph'

export interface PoolSubgraph {
  id?: string
  controller?: string
  publicSwap?: boolean
  finalized?: boolean
  crp?: boolean
  crpController?: string
  symbol?: string
  name?: string
  rights?: string[]
  cap?: string // Big
  active?: boolean
  swapFee?: string // Big
  totalWeight?: string // Big
  totalShares?: string // Big
  totalSwapVolume?: string // Big
  totalSwapFee?: string // Big
  liquidity?: string // Big
  tokensList?: string[]
  tokens?: PoolTokenSubgraph[]
  shares?: PoolShareSubgraph[]
  createTime?: number
  tokensCount?: string // Big
  holdersCount?: string // Big
  joinsCount?: string // Big
  exitsCount?: string // Big
  swapsCount?: string // Big
  factoryID?: BalancerSubgraph
  tx?: string
  swaps?: SwapSubgraph[]
}
