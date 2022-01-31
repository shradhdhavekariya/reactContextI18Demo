import { gql } from '@apollo/client'

const typeDefs = gql`
  extend type PoolToken {
    id: ID! # poolId + token address
    poolId: Pool!
    symbol: String
    name: String
    decimals: Int!
    address: String!
    balance: BigDecimal!
    denormWeight: BigDecimal!
  }

  extend type User @entity {
    id: ID!
    sharesOwned: [PoolShare!] @derivedFrom(field: "userAddress")
    txs: [Transaction!] @derivedFrom(field: "userAddress")
    swaps: [Swap!] @derivedFrom(field: "userAddress")
  }
`

export default typeDefs
