interface IAddressBalance {
  address: string
  balance: string
}

interface ISmtSupplyAttribute {
  addresses: IAddressBalance[]
  circulating_supply: string
  total_supply: string
}

export interface ISmtSupplyResponse {
  attributes: ISmtSupplyAttribute
  id: string
  type: string
}
