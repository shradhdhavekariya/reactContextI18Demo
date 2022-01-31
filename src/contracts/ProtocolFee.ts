import { Signer } from 'ethers'
import abi from 'src/contracts/abi'
import { normalize } from 'src/shared/utils/big-helpers'
import AbstractContract, { ContractInstances } from './AbstractContract'
// eslint-disable-next-line import/no-cycle
import { BPoolProxy } from './BPoolProxy'

type ProtocolFeeMethods =
  | 'MAX_FEE'
  | 'MIN_FEE'
  | 'ONE'
  | 'minProtocolFee'
  | 'protocolFee'

export class ProtocolFee extends AbstractContract {
  static instances: ContractInstances<ProtocolFee> = {}

  static MAX_FEE: number

  static MIN_FEE: number

  static ONE: number

  static minProtocolFee: number

  static protocolFee: number

  constructor(address: string, signer?: Signer) {
    super(address, abi.ProtocolFee, signer)
  }

  static getInstance = async (): Promise<ProtocolFee> => {
    const protocolFeeAddress = await BPoolProxy.getProtocolFeeAddress()

    if (!ProtocolFee.instances[protocolFeeAddress]) {
      ProtocolFee.instances[protocolFeeAddress] = new ProtocolFee(
        protocolFeeAddress,
      )
      await ProtocolFee.instances[protocolFeeAddress].init()
    }
    return ProtocolFee.instances[protocolFeeAddress]
  }

  private static getVar = async (
    methodName: ProtocolFeeMethods,
  ): Promise<number> => {
    const protocolFeeContract = await ProtocolFee.getInstance()
    const resp = await protocolFeeContract?.contract?.[methodName]()

    return resp ? normalize(resp, 18).toNumber() : 0
  }

  static getMaxFee = async () => {
    if (!ProtocolFee.MAX_FEE) {
      ProtocolFee.MAX_FEE = await ProtocolFee.getVar('MAX_FEE')
    }

    return ProtocolFee.MAX_FEE
  }

  static getMinFee = async () => {
    if (!ProtocolFee.MIN_FEE) {
      ProtocolFee.MIN_FEE = await ProtocolFee.getVar('MIN_FEE')
    }

    return ProtocolFee.MIN_FEE
  }

  static getOne = async () => {
    if (!ProtocolFee.ONE) {
      ProtocolFee.ONE = await ProtocolFee.getVar('ONE')
    }

    return ProtocolFee.ONE
  }

  static getMinProtocolFee = async () => {
    if (!ProtocolFee.minProtocolFee) {
      ProtocolFee.minProtocolFee = await ProtocolFee.getVar('minProtocolFee')
    }

    return ProtocolFee.minProtocolFee
  }

  static getProtocolFee = async () => {
    if (!ProtocolFee.protocolFee) {
      ProtocolFee.protocolFee = await ProtocolFee.getVar('protocolFee')
    }

    return ProtocolFee.protocolFee
  }
}
