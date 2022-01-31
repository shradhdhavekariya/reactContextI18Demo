import { ethers, providers, utils } from 'ethers'
import { BehaviorSubject } from 'rxjs'
import Big from 'big.js'
import CPKConstructor, {
  CPKConfig,
  EthersAdapter,
  ExecOptions,
  Transaction,
  TransactionResult,
} from 'contract-proxy-kit'
import {
  walletProvider$,
  getSigner,
  account$,
  networkId$,
} from 'src/shared/web3'
import abi from './contracts/abi'
import { BPoolProxy } from './contracts/BPoolProxy'
import { ProxyToken } from './shared/types/tokens'
import useObservable from './shared/hooks/useObservable'
import { denormalize } from './shared/utils/big-helpers'

const Erc20Interface = new utils.Interface(abi.ERC20)
const XTokenInterface = new utils.Interface(abi.XToken)
const XTokenWrapperInterface = new utils.Interface(abi.XTokenWrapper)

export class CPK extends CPKConstructor {
  private txs: Transaction[] = []

  private wrapperAddress = ''

  static async create(opts?: CPKConfig): Promise<CPK> {
    const cpk = new CPK(opts)
    if (opts) {
      await cpk.init()
    }

    cpk.txs = []

    return cpk
  }

  setXTokenWrapperAddress(address: string) {
    this.wrapperAddress = address
  }

  patchTxs = (incomeTx: Transaction) => {
    this.txs = this.txs.concat(incomeTx)
  }

  execStoredTxs = (
    slice?: { start?: number; end?: number },
    options?: ExecOptions,
  ): Promise<TransactionResult> =>
    super.execTransactions(this.txs.slice(slice?.start, slice?.end), options)

  transferToken = (userAddress: string, tokenAddress: string, amount: Big) => {
    const tx = {
      to: tokenAddress,
      data: Erc20Interface.encodeFunctionData('transfer', [
        userAddress,
        amount.toFixed(0),
      ]),
    }

    this.patchTxs(tx)
  }

  transferTokenFrom = (
    userAddress: string,
    tokenAddress: string,
    amount: Big,
  ) => {
    const tx = {
      to: tokenAddress,
      data: Erc20Interface.encodeFunctionData('transferFrom', [
        userAddress,
        this.address,
        amount.toFixed(0),
      ]),
    }

    this.patchTxs(tx)
  }

  approveCpkTokenFor = (
    tokenAddress: string,
    tokenInterface: 'erc20' | 'xToken',
    spender: string,
    amount: Big,
  ) => {
    const abiInterface =
      tokenInterface === 'erc20' ? Erc20Interface : XTokenInterface

    const tx = {
      to: tokenAddress,
      data: abiInterface.encodeFunctionData('approve', [
        spender,
        amount.toFixed(0),
      ]),
    }

    this.patchTxs(tx)
  }

  wrapToken = (tokenAddress: string, amount: Big) => {
    const tx = {
      to: this.wrapperAddress,
      data: XTokenWrapperInterface.encodeFunctionData('wrap', [
        tokenAddress,
        amount.toFixed(0),
      ]),
    }

    this.patchTxs(tx)
  }

  unwrapXToken = (xTokenAddress: string, amount: Big) => {
    const tx = {
      to: this.wrapperAddress,
      data: XTokenWrapperInterface.encodeFunctionData('unwrap', [
        xTokenAddress,
        amount.toFixed(0),
      ]),
    }

    this.patchTxs(tx)
  }

  claimAll = async (receiver: string, tokens: ProxyToken[]) => {
    if (!this.wrapperAddress) {
      const xTokenWrapperAddress = await BPoolProxy.getXTokenWrapperAddress()
      this.setXTokenWrapperAddress(xTokenWrapperAddress)
    }
    tokens.forEach((token) => {
      const balance = denormalize(token.cpkXTokenBalance ?? 0, token.decimals)

      if (token.xToken && balance?.gt(0)) {
        this.approveCpkTokenFor(
          token.xToken.id,
          'erc20',
          this.wrapperAddress,
          balance,
        )
        this.unwrapXToken(token.xToken.id, balance)
        this.transferToken(receiver, token.id, balance)
      }
    })

    return this.execStoredTxs()
  }

  resetStoredTxs = () => {
    this.txs = []
  }

  getStoredTxs = () => this.txs
}

export const createCpk = async (provider?: providers.Web3Provider) => {
  const signer = getSigner(provider)

  if (signer) {
    try {
      return await CPK.create({
        ethLibAdapter: new EthersAdapter({
          ethers,
          signer,
        }),
        networks: {
          80001: {
            masterCopyAddress: '0xB278F3686491db0261B27E3aE133C682c0A2b5ed',
            proxyFactoryAddress: '0x7983d49B5714b30eaC2B991ae011004992B9173c',
            multiSendAddress: '0xB897bE939E7c9B4d49C4E3C38E8970c8d0FbC6bC',
            fallbackHandlerAddress:
              '0xc41aEF823a8699fFE65ED0E0EAD41AacB6b82E15',
          },
        },
      })
    } catch {
      return null
    }
  }

  return null
}

/**
 * undefined means that no wallet is connected
 * null means the cpk is being loaded
 */
export const cpk$ = new BehaviorSubject<CPK | null | undefined>(undefined)

walletProvider$.subscribe((provider) => {
  if (provider instanceof providers.Web3Provider) {
    cpk$.next(null)
    createCpk(provider).then((cpk) => cpk$.next(cpk))
  }
})

networkId$.subscribe((networkId) => {
  if (networkId) {
    cpk$.next(null)
    createCpk().then((cpk) => cpk$.next(cpk))
  }
})

account$.subscribe((account) => {
  // If account is not empty set to null (cpk is loading)
  if (account) {
    cpk$.next(null)
    createCpk().then((cpk) => cpk$.next(cpk))
    // If account is empty set to undefined (no cpk)
  } else {
    cpk$.next(undefined)
  }
})

export const useCpk = () => useObservable(cpk$, null)

export const getCpk = () => cpk$.getValue()
