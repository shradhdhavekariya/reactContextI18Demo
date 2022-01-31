export interface NewPoolAsset {
  id: string
  weight: string
  amount: string
}

export interface NewPoolSchema {
  swapFee: number
  assets: NewPoolAsset[]
}
