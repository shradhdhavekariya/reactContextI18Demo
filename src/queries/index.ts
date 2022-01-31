import { loader } from 'graphql.macro'

export const AllPoolsQuery = loader('./AllPools.gql')
export const NativeTokensQuery = loader('./NativeTokens.gql')
export const SinglePoolQuery = loader('./Pool.gql')
export const PoolsQuery = loader('./Pools.gql')
export const PoolSharesQuery = loader('./PoolShares.gql')
export const PoolTokensQuery = loader('./PoolTokens.gql')
export const SwapsQuery = loader('./Swaps.gql')
export const UserQuery = loader('./UserQuery.gql')
export const XTokensQuery = loader('./xTokens.gql')
