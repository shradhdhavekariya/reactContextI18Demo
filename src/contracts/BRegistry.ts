import { Signer } from 'ethers'
import abi from 'src/contracts/abi'
import AbstractContract, { ContractInstances } from './AbstractContract'
import { BPoolProxy } from './BPoolProxy'

const POOLS_LIMIT = 5

export class BRegistry extends AbstractContract {
  static instances: ContractInstances<BRegistry> = {}

  constructor(address: string, signer?: Signer) {
    super(address, abi.BRegistry, signer)
  }

  getBestPoolsWithLimit = async (
    fromXTokenAddress: string,
    destXTokenAddress: string,
    limit: number,
  ): Promise<string[]> => {
    await this.init()

    try {
      const poolAddress: string[] = await this.contract?.getBestPoolsWithLimit(
        fromXTokenAddress,
        destXTokenAddress,
        limit,
      )
      return poolAddress?.map((address) => address.toLowerCase()) || []
    } catch {
      return []
    }
  }

  static getInstance = async (): Promise<BRegistry> => {
    const bRegistryAddress = await BPoolProxy.getRegistryAddress()

    if (!BRegistry.instances[bRegistryAddress]) {
      BRegistry.instances[bRegistryAddress] = new BRegistry(bRegistryAddress)
      await BRegistry.instances[bRegistryAddress].init()
    }
    return BRegistry.instances[bRegistryAddress]
  }

  static getBestPoolAddress = async (
    fromToken: string,
    destToken: string,
  ): Promise<string> => {
    const bRegistry = await BRegistry.getInstance()
    const [poolAddress = ''] = await bRegistry.getBestPoolsWithLimit(
      fromToken,
      destToken,
      POOLS_LIMIT,
    )

    return poolAddress
  }
}
