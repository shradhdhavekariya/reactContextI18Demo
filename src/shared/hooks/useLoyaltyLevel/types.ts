export interface PoolIdTokenType {
  address: string
  balance: string
  denormWeight: string
  xToken: {
    token: {
      id: string
      symbol: string
    }
  }
}

export interface PoolIdType {
  totalShares: string
  totalWeight: string
  tokens: PoolIdTokenType[]
}

export interface SharesOwnedType {
  balance: string
  poolId: PoolIdType
}
