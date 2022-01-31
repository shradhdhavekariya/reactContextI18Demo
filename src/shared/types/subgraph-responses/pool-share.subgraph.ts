// eslint-disable-next-line import/no-cycle
import { PoolSubgraph } from './pool.subgraph'
// eslint-disable-next-line import/no-cycle
import { UserSubgraph } from './user.subgraph'

export interface PoolShareSubgraph {
  id?: string
  poolId?: PoolSubgraph
  balance?: string // Big
  userAddress?: UserSubgraph
}
