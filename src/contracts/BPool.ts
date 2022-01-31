import abi from 'src/contracts/abi'
import { getCurrentConfig } from 'src/shared/observables/configForNetwork'
import { normalize } from 'src/shared/utils/big-helpers'
import AbstractContract, { ContractInstances } from './AbstractContract'

const { bPoolAddress } = getCurrentConfig()

type BPoolVars = 'BONE' | 'EXIT_FEE'

export class BPool extends AbstractContract {
  static instances: ContractInstances<BPool> = {}

  static BONE: number

  static EXIT_FEE: number

  constructor() {
    super(bPoolAddress, abi.BPool)
  }

  static getInstance = async (): Promise<BPool> => {
    if (!BPool.instances[bPoolAddress]) {
      BPool.instances[bPoolAddress] = new BPool()
      await BPool.instances[bPoolAddress].init()
    }
    return BPool.instances[bPoolAddress]
  }

  private static getVar = async (methodName: BPoolVars): Promise<number> => {
    const bPool = await BPool.getInstance()
    const resp = await bPool?.contract?.[methodName]()

    return resp ? normalize(resp, 18).toNumber() : 0
  }

  static getBone = async () => {
    if (!BPool.BONE) {
      BPool.BONE = await BPool.getVar('BONE')
    }

    return BPool.BONE
  }

  static getExitFee = async () => {
    if (!BPool.EXIT_FEE) {
      BPool.EXIT_FEE = await BPool.getVar('EXIT_FEE')
    }

    return BPool.EXIT_FEE
  }
}
