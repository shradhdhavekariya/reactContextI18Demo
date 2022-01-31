import abi from 'src/contracts/abi'
import { getCurrentConfig } from 'src/shared/observables/configForNetwork'
import { big, normalize, ZERO } from 'src/shared/utils/big-helpers'
import Big from 'big.js'
import { BigNumber } from 'ethers'
import { isAddress } from 'ethers/lib/utils'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import AbstractContract, { ContractInstances } from './AbstractContract'
import { Erc20 } from './ERC20'

const { smtDistributorAddress } = getCurrentConfig()

export class SmtDistributor extends AbstractContract {
  static instances: ContractInstances<SmtDistributor> = {}

  constructor() {
    super(smtDistributorAddress, abi.SmtDistributor)
  }

  static getInstance = async (): Promise<SmtDistributor> => {
    if (!SmtDistributor.instances[smtDistributorAddress]) {
      SmtDistributor.instances[smtDistributorAddress] = new SmtDistributor()
      await SmtDistributor.instances[smtDistributorAddress].init()
    }
    return SmtDistributor.instances[smtDistributorAddress]
  }

  private getToken = async () => {
    await this.init()

    try {
      const tokenAddress: string = await this.contract?.token()
      return tokenAddress
    } catch {
      return ''
    }
  }

  private getClaimableAmount = async (userAddress?: string): Promise<Big> => {
    if (!userAddress || !isAddress(userAddress)) return ZERO
    await this.init()

    try {
      const amount: BigNumber = await this.contract?.beneficiaries(userAddress)

      const tokenAddress = await this.getToken()
      const decimals = await Erc20.getDecimals(tokenAddress)

      return normalize(big(amount.toString()), decimals)
    } catch {
      return ZERO
    }
  }

  private claim = async (
    userAddress?: string,
  ): Promise<TransactionResponse | undefined> => {
    try {
      await this.init()
      const availableAmount = await this.getClaimableAmount(userAddress)

      if (availableAmount.gt(0)) {
        await this.updateSigner()
        return this.contract?.claim()
      }
      return undefined
    } catch {
      return undefined
    }
  }

  static getClaimableAmount = async (userAddress?: string) => {
    const smtDistributor = await SmtDistributor.getInstance()
    return smtDistributor.getClaimableAmount(userAddress)
  }

  static claimRewards = async (userAddress?: string) => {
    const smtDistributor = await SmtDistributor.getInstance()

    return smtDistributor.claim(userAddress)
  }
}
