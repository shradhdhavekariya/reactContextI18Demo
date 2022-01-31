import { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { QueryHookOptions } from '@apollo/client/react/types/types'
import { flow } from 'lodash'
import { NativeTokensQuery } from 'src/queries'
import {
  NativeTokensFilterSGQuery,
  NativeTokenSubgraph,
} from 'src/shared/types/subgraph-responses'
import {
  fillEtherFields,
  idToAddress,
  idToAddressXToken,
} from 'src/shared/utils'
import { createMapper } from 'src/utils'
import { NativeToken } from 'src/shared/types/tokens'

interface NativeTokensResponse {
  tokens: Required<NativeTokenSubgraph>[]
}

interface NativeTokensQueryVariables {
  filter?: NativeTokensFilterSGQuery
}

const mapper = flow(
  createMapper<NativeToken>(idToAddress, idToAddressXToken, fillEtherFields),
)

export const useNativeTokens = <T>(
  options?: QueryHookOptions<NativeTokensResponse, NativeTokensQueryVariables>,
) => {
  const { data, ...respOptions } = useQuery<
    NativeTokensResponse,
    NativeTokensQueryVariables
  >(NativeTokensQuery, options)

  const nativeTokens = useMemo<T[]>(() => mapper(data?.tokens || []), [
    data?.tokens,
  ])

  return {
    nativeTokens,
    ...respOptions,
    loading: respOptions.loading,
  }
}
