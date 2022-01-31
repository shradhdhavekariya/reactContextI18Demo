import { TransactionResponse } from '@ethersproject/abstract-provider'
import Big from 'big.js'
import { BigNumber, ContractInterface, Signer } from 'ethers'
import { constants as EthConstants } from 'ethers/lib/ethers'
import abi from 'src/contracts/abi'
import blotout from 'src/services/blotout'
import { getTokenInfo } from 'src/services/token-info'
import { DEFAULT_DECIMALS, NATIVE_ETH } from 'src/shared/consts'
import { getAllowanceCacheKey } from 'src/shared/observables/allowanceOf'
import { invalidateKeys } from 'src/shared/observables/watcher'
import { big, normalize, ZERO } from 'src/shared/utils/big-helpers'
import AbstractContract, { ContractInstances } from './AbstractContract'

const { MaxUint256, Zero } = EthConstants

export class Erc20 extends AbstractContract {
  static instances: ContractInstances<Erc20> = {}

  protected static cachedDecimals: Record<string, number> = {}

  private name?: string

  private symbol?: string

  private decimals = DEFAULT_DECIMALS

  private totalSupply?: Big

  constructor(
    address: string,
    tokenAbi: ContractInterface = abi.ERC20,
    signer?: Signer,
  ) {
    super(address, tokenAbi, signer)
  }

  static getInstance = async (address: string): Promise<Erc20> => {
    if (!Erc20.instances[address]) {
      Erc20.instances[address] = new Erc20(address)
      await Erc20.instances[address].init()
    }
    return Erc20.instances[address]
  }

  public setTokenInfo = async () => {
    try {
      const tokenInfo = await getTokenInfo(this.address)
      this.name = tokenInfo.name
      this.decimals = tokenInfo.decimals
      this.symbol = tokenInfo.symbol
    } catch {
      this.name = ''
      this.symbol = ''
    }
  }

  public async getName(): Promise<string> {
    if (typeof this.name === 'undefined') {
      await this.setTokenInfo()
    }

    return this.name as string
  }

  public async getSymbol(): Promise<string> {
    if (typeof this.symbol === 'undefined') {
      await this.setTokenInfo()
    }

    return this.symbol as string
  }

  public async balanceOf(addr?: string) {
    try {
      await this.init()
      const a = addr || (await this.contract?.signer.getAddress())
      const balance: BigNumber = await this.contract?.balanceOf(a)
      const decimals = await this.getDecimals()

      return normalize(balance.toString(), decimals)
    } catch {
      return ZERO
    }
  }

  public async mint(denormAmount?: Big): Promise<TransactionResponse> {
    await this.init()
    await this.updateSigner()
    return this.contract?.mint(denormAmount?.toFixed(0))
  }

  public getAllowance = async (account?: string, spender?: string) => {
    if (!account || !spender) return ZERO

    try {
      await this.init()

      if (this.contract?.address === NATIVE_ETH.address) {
        return big(-1)
      }

      const allowance: BigNumber = await this.contract?.allowance(
        account,
        spender,
      )

      return big(allowance?.toString() || 0)
    } catch {
      return ZERO
    }
  }

  async allowance(userAddress?: string, cpkAddress?: string) {
    try {
      const bigAllowance = await this.getAllowance(userAddress, cpkAddress)
      const decimals = await this.getDecimals()

      return normalize(bigAllowance, decimals).toNumber()
    } catch {
      return 0
    }
  }

  private async approve(
    cpkAddress: string,
    amount: BigNumber,
  ): Promise<TransactionResponse> {
    await this.init()
    await this.updateSigner()
    return this.contract?.approve(cpkAddress, amount)
  }

  enableToken = async (cpkAddress: string) => {
    const account = await this.signer?.getAddress()

    const resp = await this.approve(cpkAddress, MaxUint256)

    if (account) {
      invalidateKeys(getAllowanceCacheKey(account, cpkAddress, this.address))
    }

    const symbol = await this.getSymbol()
    blotout.captureEnableAsset(this.address, symbol)

    return resp
  }

  disableToken = async (cpkAddress: string) => {
    const resp = await this.approve(cpkAddress, Zero)

    const symbol = await this.getSymbol()
    blotout.captureDisableAsset(this.address, symbol)

    return resp
  }

  static async getDecimals(address: string): Promise<number> {
    const tokenInfo = await getTokenInfo(address)

    return tokenInfo?.decimals || DEFAULT_DECIMALS
  }

  public async getDecimals(): Promise<number> {
    if (typeof this.decimals === 'undefined') {
      await this.setTokenInfo()
    }

    return this.decimals as number
  }

  public getTotalSupply = async () => {
    if (this.totalSupply) return this.totalSupply

    try {
      await this.init()
      const total: BigNumber = await this.contract?.totalSupply()
      const decimals = await this.getDecimals()

      return normalize(total.toString(), decimals)
    } catch {
      return ZERO
    }
  }
}
