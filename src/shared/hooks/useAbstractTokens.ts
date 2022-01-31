import { useMemo } from 'react'
import {
  ApolloError,
  DocumentNode,
  QueryHookOptions,
  TypedDocumentNode,
  useQuery,
} from '@apollo/client'
import { prettifyTokenList } from 'src/shared/utils'
import { AbstractToken } from '../types/tokens'
import { Obj } from '../types'

interface AbstractTokensResponse<K> {
  allTokens: K[]
  tokenAddrs: string[]
  tokenSymbols: string[]
  loading: boolean
  error: ApolloError | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refetch: any
  fetched: boolean
}

const useAbstractTokens = <TData extends AbstractToken>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryDoc: DocumentNode | TypedDocumentNode<any, Obj>,
  queryOptions?: QueryHookOptions<Record<string, TData[]>, Obj>,
): AbstractTokensResponse<TData> => {
  const { data, loading, error, refetch } = useQuery<Record<string, TData[]>>(
    queryDoc,
    queryOptions,
  )
  const tokensArray = useMemo(() => {
    const tokensArrayKey = Object.keys(data || {})[0]
    return data?.[tokensArrayKey] || []
  }, [data])

  const allTokens = useMemo(() => prettifyTokenList<TData>(tokensArray), [
    tokensArray,
  ])

  const tokenAddrs = useMemo(() => allTokens.map((token) => token.id), [
    allTokens,
  ])

  const tokenSymbols = useMemo(() => allTokens.map((token) => token.symbol), [
    allTokens,
  ])

  return {
    allTokens,
    tokenAddrs,
    tokenSymbols,
    loading,
    error,
    refetch,
    fetched: !!data,
  }
}

export default useAbstractTokens
