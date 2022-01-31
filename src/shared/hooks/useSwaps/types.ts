import { ApolloError, ApolloQueryResult } from '@apollo/client'
import { Swap } from 'src/shared/types'

export interface UseSwapsOptions {
  tokenPair?: [string, string]
  dateFrom?: Date
  ignore?: boolean
  userAddress?: string | null
  limit?: number
}

export interface SwapQueryVariables {
  filter: {
    tokenIn_in?: string[]
    tokenOut_in?: string[]
    timestamp_gt?: number
  }
  limit?: number
  skip?: number
}

export interface SwapsQueryResult {
  data:
    | {
        swaps: Swap[]
      }
    | undefined
  called: boolean
  loading: boolean
  error: ApolloError | undefined
  refetching: boolean
  refetch: (
    limit?: number | undefined,
  ) => Promise<ApolloQueryResult<{
    swaps: Swap[]
  }> | null> | void
  fetchMore: () => Promise<void> | void
  hasMore: boolean
}
