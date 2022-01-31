import Big from 'big.js'
import { Pool } from '../pool'
import { PoolToken } from '../tokens'

export type LiquidityActionType = 'add' | 'remove'

export interface PoolOverviewProps
  extends Pick<Pool, 'id' | 'swapFee' | 'totalShares'> {
  tokens: PoolToken[]
  poolTokensToIssue: Big
  userPoolTokenBalance: Big
  action: LiquidityActionType
}
