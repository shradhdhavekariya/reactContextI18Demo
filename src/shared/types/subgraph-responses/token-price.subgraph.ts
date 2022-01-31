export interface TokenPriceSubgraph {
  id?: string
  symbol?: string
  name?: string
  decimals?: number
  price?: string // Big
  poolLiquidity?: string // Big
  poolTokenId?: string
}
