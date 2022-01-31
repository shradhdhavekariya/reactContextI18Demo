import { getCurrentConfig } from 'src/shared/observables/configForNetwork'

const { vSmtAddress } = getCurrentConfig()

export const VSMT_TOKEN = {
  id: vSmtAddress,
  address: vSmtAddress,
  symbol: 'vSMT',
  name: 'Vesting Swarm Markets Token',
  decimals: 18,
}

export const NATIVE_ETH = {
  id: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  symbol: 'ETH',
  name: 'Ethereum',
  decimals: 18,
}
