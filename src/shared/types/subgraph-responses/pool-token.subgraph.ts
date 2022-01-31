// eslint-disable-next-line import/no-cycle
import { XTokenSubgraph } from './x-token.subgraph'
// eslint-disable-next-line import/no-cycle
import { PoolSubgraph } from './pool.subgraph'

export interface PoolTokenSubgraph {
  id?: string
  name?: string
  symbol?: string
  decimals?: number
  address?: string
  balance?: string // Big
  denormWeight?: string // Big
  xToken?: XTokenSubgraph
  poolId?: PoolSubgraph
}
