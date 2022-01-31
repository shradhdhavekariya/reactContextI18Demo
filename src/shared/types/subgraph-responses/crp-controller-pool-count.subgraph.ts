// eslint-disable-next-line import/no-cycle
import { BalancerSubgraph } from './balancer.subgraph'

export interface CrpControllerPoolCountSubgraph {
  id?: string
  factoryID?: BalancerSubgraph
  poolCount?: number
}
