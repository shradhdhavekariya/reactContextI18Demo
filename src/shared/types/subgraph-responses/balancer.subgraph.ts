// eslint-disable-next-line import/no-cycle
import { PoolSubgraph } from './pool.subgraph'
// eslint-disable-next-line import/no-cycle
import { CrpControllerPoolCountSubgraph } from './crp-controller-pool-count.subgraph'

export interface BalancerSubgraph {
  id?: string
  color?: string
  poolCount?: number
  finalizedPoolCount?: number
  crpCount?: number
  crpControllerCount?: CrpControllerPoolCountSubgraph[]
  privateCount?: number
  pools?: PoolSubgraph[]
  txCount?: string // Big
  totalLiquidity?: string // Big
  totalSwapVolume?: string // Big
  totalSwapFee?: string // Big
}
