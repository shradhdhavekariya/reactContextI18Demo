// eslint-disable-next-line import/no-cycle
import { XTokenSubgraph } from './x-token.subgraph'

export interface NativeTokenSubgraph {
  id?: string
  name?: string
  symbol?: string
  decimals?: number
  xToken?: XTokenSubgraph
}
