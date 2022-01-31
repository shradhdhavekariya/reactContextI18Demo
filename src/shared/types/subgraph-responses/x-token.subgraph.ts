// eslint-disable-next-line import/no-cycle
import { NativeTokenSubgraph } from './native-token.subgraph'
// eslint-disable-next-line import/no-cycle
import { PoolTokenSubgraph } from './pool-token.subgraph'

export interface XTokenSubgraph {
  id?: string
  name?: string
  symbol?: string
  decimals?: number
  paused?: boolean
  token?: NativeTokenSubgraph
  poolTokens?: PoolTokenSubgraph[]
}
