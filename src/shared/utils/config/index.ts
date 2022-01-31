import {
  NetworkMap,
  MAIN_NETWORKS,
  POLYGON_NETWORK_IDS,
} from 'src/shared/consts/common-evm-networks'
import { envNames } from 'src/shared/consts/env-names'
import { NetworkId } from 'src/shared/types/config'

export const getNetworkById = (id: NetworkId | number) =>
  NetworkMap.get(id)?.networkName.toUpperCase() || 'UNRECOGNIZED_NETWORK'

export const getRpcPrefixById = (id: NetworkId) =>
  NetworkMap.get(id)?.rpcPrefix.toUpperCase()

const getRpcUrl = (networkId: NetworkId, infuraId: string) =>
  infuraId
    ? `https://${getRpcPrefixById(networkId)}.infura.io/v3/${infuraId}`
    : ''

export const generateRpcUrls = (chainIds: NetworkId[], infuraId: string) =>
  chainIds.reduce<Record<number, string>>(
    (map, id) => ({
      ...map,
      [id]: getRpcUrl(id, infuraId),
    }),
    {},
  )

export const validateEnv = (keys: string[]) => {
  envNames.forEach((key) => {
    if (!keys.includes(key)) {
      // eslint-disable-next-line no-console
      console.error(`Missing configuration variable: ${key}`)
    }
  })
}

export const isMainnet = (networkId: number) =>
  MAIN_NETWORKS.includes(networkId)

export const isPolygon = (networkId: number) =>
  POLYGON_NETWORK_IDS.includes(networkId)
