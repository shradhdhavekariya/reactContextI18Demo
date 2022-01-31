import Big from 'big.js'
import { BigNumber, Signer } from 'ethers'
import abi from 'src/contracts/abi'
import { normalize, ZERO } from 'src/shared/utils/big-helpers'
// eslint-disable-next-line import/no-cycle
import { BPoolProxy } from './BPoolProxy'
import AbstractContract, { ContractInstances } from './AbstractContract'

export class SmtPriceFeed extends AbstractContract {
  static instances: ContractInstances<SmtPriceFeed> = {}

  constructor(address: string, signer?: Signer) {
    super(address, abi.SmtPriceFeed, signer)
  }

  static getInstance = async (): Promise<SmtPriceFeed> => {
    const smtPriceFeedAddress = await BPoolProxy.getSmtPriceFeedAddress()

    if (!SmtPriceFeed.instances[smtPriceFeedAddress]) {
      SmtPriceFeed.instances[smtPriceFeedAddress] = new SmtPriceFeed(
        smtPriceFeedAddress,
      )
      await SmtPriceFeed.instances[smtPriceFeedAddress].init()
    }
    return SmtPriceFeed.instances[smtPriceFeedAddress]
  }

  getDecimals = async () => {
    try {
      await this.init()
      const bigDecimals: BigNumber = await this.contract?.decimals()
      return bigDecimals.toNumber()
    } catch {
      return 0
    }
  }

  // gets normalized price of `xTokenAddress` in SMT.
  getPrice = async (xTokenAddress: string): Promise<Big> => {
    try {
      await this.init()
      const decimals = await this.getDecimals()
      const price: BigNumber = await this.contract?.getPrice(xTokenAddress)

      return normalize(price.toString(), decimals)
    } catch (e) {
      // There is no price for this address
      return ZERO
    }
  }

  // gets normalized price of `xTokenAddress` in SMT.
  static getPrice = async (xTokenAddress: string): Promise<Big> => {
    try {
      const smtPriceFeed = await SmtPriceFeed.getInstance()
      return await smtPriceFeed.getPrice(xTokenAddress)
    } catch {
      return ZERO
    }
  }

  // Gets how many SMT represents the `amountIn` of `xTokenAddress`.
  // xTokenAddress of asset to get the amount.
  static calculateAmount = async (
    xTokenAddress: string,
    denormAmountIn: Big,
  ): Promise<Big> => {
    try {
      const smtPriceFeed = await SmtPriceFeed.getInstance()
      const decimals = await smtPriceFeed.getDecimals()
      const price: BigNumber = await smtPriceFeed?.contract?.calculateAmount(
        xTokenAddress,
        denormAmountIn.toFixed(0),
      )

      return normalize(price.toString(), decimals)
    } catch {
      return ZERO
    }
  }
}
