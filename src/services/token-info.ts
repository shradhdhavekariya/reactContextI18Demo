import { ApolloQueryResult } from '@apollo/client'
import apolloClient from 'src/apollo'
import { loader } from 'graphql.macro'
import { DEFAULT_DECIMALS, NATIVE_ETH } from 'src/shared/consts'

export interface TokenInfo {
  id: string
  name: string
  symbol: string
  decimals: number
}

export interface TokenInfoResponse {
  tokens: TokenInfo[]
  xtokens: TokenInfo[]
}

let tokenInfo: Record<string, TokenInfo> = {}

let requestPromise: null | Promise<ApolloQueryResult<TokenInfoResponse>> = null

export const getTokenInfo = async (id: string) => {
  if (id.toLowerCase() === NATIVE_ETH.address) {
    return NATIVE_ETH
  }

  if (!requestPromise) {
    requestPromise = apolloClient.query<TokenInfoResponse>({
      query: loader('../queries/TokensInfo.gql'),
    })

    const response = await requestPromise

    if (response.data) {
      const tokens = response.data.tokens.reduce(
        (all, token) => ({
          ...all,
          [token.id]: token,
        }),
        {},
      )

      const xTokens = response.data.xtokens.reduce(
        (all, token) => ({
          ...all,
          [token.id.toLowerCase()]: token,
        }),
        {},
      )

      tokenInfo = { ...tokens, ...xTokens }
    }
  }

  await requestPromise

  if (tokenInfo[id.toLowerCase()]) {
    return tokenInfo[id.toLowerCase()]
  }

  return {
    id,
    name: '',
    symbol: '',
    decimals: DEFAULT_DECIMALS,
  }
}
