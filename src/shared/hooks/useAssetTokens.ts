import { useMemo } from 'react'
import { NativeToken } from 'src/shared/types/tokens'
import { tokenFilter } from 'src/shared/utils'
import { NativeTokensQuery } from 'src/queries'
import useAbstractTokens from './useAbstractTokens'

const useAssetTokens = <T extends NativeToken>(
  search = '',
  filter?: (token: T) => boolean,
) => {
  const {
    allTokens,
    tokenAddrs,
    loading,
    error,
    refetch,
  } = useAbstractTokens<T>(NativeTokensQuery, {
    variables: { filter: { symbol_not: 'SPT' } },
  })

  const tokens = useMemo(() => allTokens.filter(tokenFilter(search, filter)), [
    allTokens,
    filter,
    search,
  ])

  return {
    allTokens,
    tokens,
    tokenAddrs,
    loading,
    error,
    refetch,
  }
}

export default useAssetTokens
