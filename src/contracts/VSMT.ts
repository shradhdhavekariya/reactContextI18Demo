import { BigNumber, Signer } from 'ethers'
import abi from 'src/contracts/abi'
import { isAddress } from 'ethers/lib/utils'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import { denormalize, normalize } from 'src/shared/utils/big-helpers'
import { getCurrentConfig } from 'src/shared/observables/configForNetwork'
import { ContractInstances } from './AbstractContract'
import { Erc20 } from './ERC20'

const { vSmtAddress } = getCurrentConfig()

export class VSMT extends Erc20 {
  static instances: ContractInstances<VSMT> = {}

  constructor(address: string, signer?: Signer) {
    super(address, abi.VSMTToken, signer)
  }

  static getInstance = async (): Promise<VSMT> => {
    if (!VSMT.instances[vSmtAddress]) {
      VSMT.instances[vSmtAddress] = new VSMT(vSmtAddress)
      await VSMT.instances[vSmtAddress].init()
    }
    return VSMT.instances[vSmtAddress]
  }

  public async getClaimableAmount(address: string) {
    if (!isAddress(address)) return 0

    try {
      await this.init()
      const dec = await Erc20.getDecimals(this.address)
      const amount: BigNumber = await this.contract?.getClaimableAmount(address)

      return normalize(amount.toString(), dec).toNumber()
    } catch {
      return 0
    }
  }

  public async claim(amount: number) {
    await this.init()
    const dec = await Erc20.getDecimals(this.address)
    const denormAmount = denormalize(amount, dec)

    await this.updateSigner()
    return this.contract?.claim(denormAmount.toString())
  }

  public async claimMaximumAmount(
    address: string,
  ): Promise<TransactionResponse | false> {
    try {
      await this.init()
      const availableAmount = await this.getClaimableAmount(address)

      if (availableAmount > 0) {
        await this.updateSigner()
        return this.contract?.claimMaximunAmount()
      }

      return false
    } catch {
      return false
    }
  }

  static getClaimableAmount = async (address: string) => {
    const vSmt = await VSMT.getInstance()

    return vSmt.getClaimableAmount(address)
  }

  static claimMaximumAmount = async (address: string) => {
    const vSmt = await VSMT.getInstance()

    return vSmt.claimMaximumAmount(address)
  }
}
