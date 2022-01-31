// eslint-disable-next-line import/no-cycle
import { PoolShareSubgraph } from './pool-share.subgraph'
// eslint-disable-next-line import/no-cycle
import { SwapSubgraph } from './swap.subgraph'
// eslint-disable-next-line import/no-cycle
import { TransactionSubgraph } from './transaction.subgraph'

export interface UserSubgraph {
  id?: string
  sharesOwned?: PoolShareSubgraph[]
  txs?: TransactionSubgraph[]
  swaps?: SwapSubgraph[]
}
