import Big, { BigSource } from 'big.js'
import { utils } from 'ethers'
import abi from 'src/contracts/abi'
import { createCpk } from 'src/cpk'
// eslint-disable-next-line import/no-cycle
import {
  calcMultipleOutByPoolAmountIn,
  calcSingleOutByPoolAmountIn,
  calcSingleTokenAmountInByPoolAmountOut,
  calcTokenAmountInByPoolAmountOut,
} from 'src/shared/utils/pool-calc'
import { PoolExpanded } from 'src/shared/types'
import { ExtendedPoolToken } from 'src/shared/types/tokens'
import { denormalize, normalize, ZERO } from 'src/shared/utils/big-helpers'
import verify from 'src/shared/utils/verify'
import { propEquals } from 'src/shared/utils/collection/filters'
import { getCurrentConfig } from 'src/shared/observables/configForNetwork'
import blotout from 'src/services/blotout'
import { SPT_DECIMALS } from 'src/shared/consts'
import { isUnlocked } from 'src/shared/utils/tokens/allowance'
import AbstractContract, { ContractInstances } from './AbstractContract'

const { bPoolProxyAddress } = getCurrentConfig()

const BPoolProxyInterface = new utils.Interface(abi.BPoolProxy)

type BPoolProxyVars =
  | 'registry'
  | 'xTokenWrapper'
  | 'protocolFee'
  | 'utilityToken'
  | 'utilityTokenFeed'

export class BPoolProxy extends AbstractContract {
  static instances: ContractInstances<BPoolProxy> = {}

  static xTokenWrapperAddress: string

  static registryAddress: string

  static protocolFeeAddress: string

  static smtPriceFeedAddress: string

  static utilityToken: string

  constructor() {
    super(bPoolProxyAddress, abi.BPoolProxy)
  }

  static getInstance = async (): Promise<BPoolProxy> => {
    if (!BPoolProxy.instances[bPoolProxyAddress]) {
      BPoolProxy.instances[bPoolProxyAddress] = new BPoolProxy()
      await BPoolProxy.instances[bPoolProxyAddress].init()
    }
    return BPoolProxy.instances[bPoolProxyAddress]
  }

  private static getVar = async <T = string>(
    varName: BPoolProxyVars,
  ): Promise<T> => {
    const bPoolProxy = await BPoolProxy.getInstance()
    return bPoolProxy?.contract?.[varName]()
  }

  static getRegistryAddress = async () => {
    if (!BPoolProxy.registryAddress) {
      BPoolProxy.registryAddress = await BPoolProxy.getVar('registry')
    }

    return BPoolProxy.registryAddress
  }

  static getXTokenWrapperAddress = async () => {
    if (!BPoolProxy.xTokenWrapperAddress) {
      BPoolProxy.xTokenWrapperAddress = await BPoolProxy.getVar('xTokenWrapper')
    }

    return BPoolProxy.xTokenWrapperAddress
  }

  static getProtocolFeeAddress = async () => {
    if (!BPoolProxy.protocolFeeAddress) {
      BPoolProxy.protocolFeeAddress = await BPoolProxy.getVar('protocolFee')
    }

    return BPoolProxy.protocolFeeAddress
  }

  static getSmtPriceFeedAddress = async () => {
    if (!BPoolProxy.smtPriceFeedAddress) {
      BPoolProxy.smtPriceFeedAddress = await BPoolProxy.getVar(
        'utilityTokenFeed',
      )
    }

    return BPoolProxy.smtPriceFeedAddress
  }

  static getUtilityTokenAddress = async () => {
    if (!BPoolProxy.utilityToken) {
      BPoolProxy.utilityToken = await BPoolProxy.getVar('utilityToken')
    }

    return BPoolProxy.utilityToken
  }

  public static async joinswapPoolAmountOut(
    account: string,
    pool: PoolExpanded,
    tokenIn: ExtendedPoolToken,
    poolAmountOut: BigSource,
  ) {
    const xTokenWrapperAddress = await BPoolProxy.getXTokenWrapperAddress()
    // Verify contract addresses are assigned
    verify(!!bPoolProxyAddress, 'BPoolProxy address is missing')
    verify(!!xTokenWrapperAddress, 'XTokenWrapper address is missing')

    // Verify the CPK is defined
    const cpk = await createCpk()
    verify(!!cpk, 'Could not obtain CPK')
    cpk?.setXTokenWrapperAddress(xTokenWrapperAddress)

    const maxAmountIn = calcSingleTokenAmountInByPoolAmountOut(
      pool,
      poolAmountOut,
      tokenIn,
    )

    // Verify token approved
    verify(isUnlocked(tokenIn, maxAmountIn), 'Not enough allowance')

    // Check if the CPK has enough balance of tokenIn
    // if not add a transferFrom transaction to the batch of the necessary amount from the user to the CPK
    if (tokenIn.cpkBalance?.lt(maxAmountIn)) {
      cpk?.transferTokenFrom(
        account,
        tokenIn.id,
        maxAmountIn.minus(tokenIn.cpkBalance || 0),
      )
    }

    // Approve tokenIn in the CPK to be spent by the XTokenWrapper
    cpk?.approveCpkTokenFor(
      tokenIn.id,
      'erc20',
      xTokenWrapperAddress,
      maxAmountIn,
    )

    // Wrap tokenIn using the XTokenWrapper
    cpk?.wrapToken(tokenIn.id, maxAmountIn)

    // Approve BPoolProxy to use the CPK's ERC20 tokens
    cpk?.approveCpkTokenFor(
      tokenIn.xToken?.id || '',
      'xToken',
      bPoolProxyAddress,
      maxAmountIn,
    )

    // Prepare params of joinPool (poolAddress, poolAmountOut, MaxAmountsIn)
    const params = [
      pool.id,
      tokenIn.xToken?.id,
      denormalize(poolAmountOut, SPT_DECIMALS).toFixed(0),
      maxAmountIn.toFixed(0),
    ]

    cpk?.patchTxs({
      to: bPoolProxyAddress || '',
      data: BPoolProxyInterface.encodeFunctionData(
        'joinswapPoolAmountOut',
        params,
      ),
    })

    const resp = await cpk?.execStoredTxs()

    blotout.captureAddLiquidity(
      pool.id,
      false,
      new Big(poolAmountOut).toFixed(6),
      {
        [tokenIn.address]: normalize(maxAmountIn, tokenIn.decimals).toFixed(6),
      },
    )

    return resp
  }

  public static async joinswapExternAmountIn(
    account: string,
    pool: PoolExpanded,
    tokenIn: ExtendedPoolToken,
    minPoolAmountOut: BigSource,
  ) {
    const xTokenWrapperAddress = await BPoolProxy.getXTokenWrapperAddress()
    // Verify contract addresses are assigned
    verify(!!bPoolProxyAddress, 'BPoolProxy address is missing')
    verify(!!xTokenWrapperAddress, 'XTokenWrapper address is missing')

    // Verify the CPK is defined
    const cpk = await createCpk()
    verify(!!cpk, 'Could not obtain CPK')
    cpk?.setXTokenWrapperAddress(xTokenWrapperAddress)

    const amount = calcSingleTokenAmountInByPoolAmountOut(
      pool,
      minPoolAmountOut,
      tokenIn,
    )

    const denormalizedXtokenInCpkBalance = denormalize(
      tokenIn.xToken?.cpkBalance ?? 0,
      tokenIn.decimals ?? 0,
    )

    const transferAmountIn = denormalizedXtokenInCpkBalance.lt(amount)
      ? amount.minus(denormalizedXtokenInCpkBalance)
      : ZERO

    // Verify token approved
    verify(isUnlocked(tokenIn, transferAmountIn), 'Not enough allowance')

    // Check if the CPK has enough balance of tokenIn
    // if not add a transferFrom transaction to the batch of the necessary amount from the user to the CPK
    if (transferAmountIn.gt(0)) {
      cpk?.transferTokenFrom(account, tokenIn.id, transferAmountIn)
      // Approve tokenIn in the CPK to be spent by the XTokenWrapper
      cpk?.approveCpkTokenFor(
        tokenIn.id,
        'erc20',
        xTokenWrapperAddress,
        transferAmountIn,
      )
      // Wrap tokenIn using the XTokenWrapper
      cpk?.wrapToken(tokenIn.id, transferAmountIn)
    }

    // Approve BPoolProxy to use the CPK's ERC20 tokens
    cpk?.approveCpkTokenFor(
      tokenIn.xToken?.id || '',
      'xToken',
      bPoolProxyAddress,
      amount,
    )

    // Prepare params of joinPool (poolAddress, tokenIn, tokenAmountIn, minPoolAmountOut)
    const params = [
      pool.id,
      tokenIn.xToken?.id,
      denormalize(amount, tokenIn.xToken?.decimals).toFixed(0),
      denormalize(minPoolAmountOut, SPT_DECIMALS).toFixed(0),
    ]

    cpk?.patchTxs({
      to: bPoolProxyAddress || '',
      data: BPoolProxyInterface.encodeFunctionData(
        'joinswapExternAmountIn',
        params,
      ),
    })

    const resp = await cpk?.execStoredTxs()

    blotout.captureAddLiquidity(
      pool.id,
      false,
      new Big(minPoolAmountOut).toFixed(6),
      {
        [tokenIn.address]: normalize(amount, tokenIn.decimals).toFixed(6),
      },
    )

    return resp
  }

  public static async joinPoolMultiple(
    account: string,
    pool: PoolExpanded,
    tokens: ExtendedPoolToken[],
    poolAmountOut: BigSource,
  ) {
    const xTokenWrapperAddress = await BPoolProxy.getXTokenWrapperAddress()
    // Verify contract addresses are assigned
    verify(!!bPoolProxyAddress, 'BPoolProxy address is missing')
    verify(!!xTokenWrapperAddress, 'XTokenWrapper address is missing')

    // Verify the CPK is defined
    const cpk = await createCpk()
    verify(!!cpk, 'Could not obtain CPK')
    cpk?.setXTokenWrapperAddress(xTokenWrapperAddress)

    const amounts = tokens.map((token) =>
      calcTokenAmountInByPoolAmountOut(pool, poolAmountOut, token),
    )

    const transferAmounts = tokens.map(({ xToken, decimals }, idx) => {
      const denormalizedCpkBalance = denormalize(
        xToken?.cpkBalance ?? 0,
        decimals ?? 0,
      )

      return denormalizedCpkBalance.lt(amounts[idx])
        ? amounts[idx].minus(denormalizedCpkBalance)
        : ZERO
    })

    // Verify tokens approved
    verify(
      tokens.some((token, idx) => isUnlocked(token, transferAmounts[idx])),
      'Not enough allowance',
    )

    // For each ERC20 token, check if the CPK has enough balance
    // if not add a transferFrom transaction to the batch of the necessary amount from the user to the CPK
    tokens
      .filter((_, idx) => transferAmounts[idx].gt(0))
      .forEach(({ address }, idx) => {
        cpk?.transferTokenFrom(account, address, transferAmounts[idx])

        // Approve ERC20 tokens in the CPK to be spent by the XTokenWrapper
        cpk?.approveCpkTokenFor(
          address,
          'erc20',
          xTokenWrapperAddress,
          transferAmounts[idx],
        )

        // Wrap ERC20 tokens using the XTokenWrapper
        cpk?.wrapToken(address, transferAmounts[idx])
      })

    // Approve BPoolProxy to use the CPK's ERC20 tokens
    tokens.forEach(({ xToken }, idx) =>
      cpk?.approveCpkTokenFor(
        xToken?.id || '',
        'xToken',
        bPoolProxyAddress,
        amounts[idx],
      ),
    )

    // Prepare params of joinPool (poolAddress, poolAmountOut, MaxAmountsIn)
    const params = [
      pool.id,
      denormalize(poolAmountOut, SPT_DECIMALS).toFixed(0),
      pool.tokensList.map((address) =>
        amounts[tokens.findIndex(propEquals('xToken.id', address))].toFixed(0),
      ),
    ]

    cpk?.patchTxs({
      to: bPoolProxyAddress || '',
      data: BPoolProxyInterface.encodeFunctionData('joinPool', params),
    })

    const resp = await cpk?.execStoredTxs()

    const assetValues = tokens.reduce(
      (assets, token, idx) => ({
        ...assets,
        [token.address]: normalize(amounts[idx], token.decimals).toFixed(6),
      }),
      {},
    )
    blotout.captureAddLiquidity(
      pool.id,
      true,
      new Big(poolAmountOut).toFixed(6),
      assetValues,
    )

    return resp
  }

  public static async joinPool(
    account: string,
    pool: PoolExpanded,
    tokens: ExtendedPoolToken | ExtendedPoolToken[],
    poolAmountOut: BigSource,
  ) {
    return Array.isArray(tokens)
      ? this.joinPoolMultiple(account, pool, tokens, poolAmountOut)
      : this.joinswapExternAmountIn(account, pool, tokens, poolAmountOut)
  }

  public static async exitPoolMultiple(
    account: string,
    pool: PoolExpanded,
    tokens: ExtendedPoolToken[],
    poolAmountIn: BigSource,
  ) {
    const xTokenWrapperAddress = await BPoolProxy.getXTokenWrapperAddress()
    // Verify contract addresses are assigned
    verify(!!bPoolProxyAddress, 'BPoolProxy address is missing')
    verify(!!xTokenWrapperAddress, 'XTokenWrapper address is missing')

    // Verify the CPK is defined
    const cpk = await createCpk()
    verify(!!cpk, 'Could not obtain CPK')
    cpk?.setXTokenWrapperAddress(xTokenWrapperAddress)

    const denormalizedPoolAmountIn = denormalize(poolAmountIn, SPT_DECIMALS)

    const amounts = tokens.map((token) =>
      calcMultipleOutByPoolAmountIn(pool, poolAmountIn, token),
    )

    cpk?.approveCpkTokenFor(
      pool?.xPoolTokenAddress || '',
      'xToken',
      bPoolProxyAddress,
      denormalizedPoolAmountIn,
    )

    // Prepare params of exitPool (poolAddress, poolAmountOut, MaxAmountsIn)
    const params = [
      pool.id,
      denormalizedPoolAmountIn.toFixed(0),
      pool.tokensList.map((address) =>
        amounts[tokens.findIndex(propEquals('xToken.id', address))].toFixed(0),
      ),
    ]

    cpk?.patchTxs({
      to: bPoolProxyAddress || '',
      data: BPoolProxyInterface.encodeFunctionData('exitPool', params),
    })

    const tokenOutAmounts = tokens.map(({ xToken, decimals }, idx) =>
      amounts[idx].add(denormalize(xToken?.cpkBalance ?? 0, decimals ?? 0)),
    )

    tokens.forEach(({ xToken }, idx) =>
      cpk?.approveCpkTokenFor(
        xToken?.id || '',
        'xToken',
        xTokenWrapperAddress,
        tokenOutAmounts[idx],
      ),
    )

    tokens.forEach(({ xToken }, idx) =>
      cpk?.unwrapXToken(xToken?.id || '', tokenOutAmounts[idx]),
    )

    tokens.forEach(({ address }, idx) =>
      cpk?.transferToken(account, address, tokenOutAmounts[idx]),
    )

    const resp = await cpk?.execStoredTxs()

    const assetValues = tokens.reduce(
      (assets, token, idx) => ({
        ...assets,
        [token.address]: normalize(amounts[idx], token.decimals).toFixed(6),
      }),
      {},
    )

    blotout.captureRemoveLiquidity(
      pool.id,
      true,
      new Big(poolAmountIn).toFixed(6),
      assetValues,
    )

    return resp
  }

  public static async exitPoolSingle(
    account: string,
    pool: PoolExpanded,
    tokenOut: ExtendedPoolToken,
    poolAmountIn: BigSource,
  ) {
    const xTokenWrapperAddress = await BPoolProxy.getXTokenWrapperAddress()
    // Verify contract addresses are assigned
    verify(!!bPoolProxyAddress, 'BPoolProxy address is missing')
    verify(!!xTokenWrapperAddress, 'XTokenWrapper address is missing')

    // Verify the CPK is defined
    const cpk = await createCpk()
    verify(!!cpk, 'Could not obtain CPK')
    cpk?.setXTokenWrapperAddress(xTokenWrapperAddress)

    const denormalizedPoolAmountIn = denormalize(poolAmountIn, SPT_DECIMALS)

    const amount = calcSingleOutByPoolAmountIn(pool, poolAmountIn, tokenOut)

    cpk?.approveCpkTokenFor(
      pool?.xPoolTokenAddress || '',
      'xToken',
      bPoolProxyAddress,
      denormalizedPoolAmountIn,
    )

    // Prepare params of joinPool (poolAddress, poolAmountOut, MaxAmountsIn)
    const params = [
      pool.id,
      tokenOut.xToken?.id,
      denormalizedPoolAmountIn.toFixed(0),
      amount.toFixed(0),
    ]

    cpk?.patchTxs({
      to: bPoolProxyAddress || '',
      data: BPoolProxyInterface.encodeFunctionData(
        'exitswapPoolAmountIn',
        params,
      ),
    })

    const tokenOutAmount = amount.add(
      denormalize(tokenOut.xToken?.cpkBalance ?? 0, tokenOut.decimals ?? 0),
    )

    cpk?.approveCpkTokenFor(
      tokenOut?.xToken?.id || '',
      'xToken',
      xTokenWrapperAddress,
      tokenOutAmount,
    )

    cpk?.unwrapXToken(tokenOut?.xToken?.id || '', tokenOutAmount)

    cpk?.transferToken(account, tokenOut.address, tokenOutAmount)

    const resp = await cpk?.execStoredTxs()

    blotout.captureRemoveLiquidity(
      pool.id,
      false,
      new Big(poolAmountIn).toFixed(6),
      {
        [tokenOut.address]: normalize(amount, tokenOut.decimals).toFixed(6),
      },
    )

    return resp
  }

  public static async exitPool(
    account: string,
    pool: PoolExpanded,
    tokens: ExtendedPoolToken | ExtendedPoolToken[],
    poolAmountIn: BigSource,
  ) {
    return Array.isArray(tokens)
      ? this.exitPoolMultiple(account, pool, tokens, poolAmountIn)
      : this.exitPoolSingle(account, pool, tokens, poolAmountIn)
  }

  public static async swapExactIn(
    account: string,
    tokenIn: ExtendedPoolToken,
    tokenOut: ExtendedPoolToken,
    amountIn: Big,
    minAmountOut: Big,
    protocolFee: Big,
    utilityToken?: ExtendedPoolToken,
  ) {
    const xTokenWrapperAddress = await BPoolProxy.getXTokenWrapperAddress()

    const useUtilityToken = utilityToken !== undefined
    const denormSMTFee = useUtilityToken
      ? denormalize(protocolFee, utilityToken?.decimals)
      : ZERO

    const denormAmounts = {
      exactIn: denormalize(
        amountIn.add(useUtilityToken ? 0 : protocolFee),
        tokenIn.decimals,
      ),
      minOut: denormalize(minAmountOut, tokenOut.decimals),
    }

    const amounts = Object.values(denormAmounts)
    const tokens = [tokenIn, tokenOut]

    // Verify contract addresses are assigned
    verify(!!bPoolProxyAddress, 'BPoolProxy address is missing')
    verify(!!xTokenWrapperAddress, 'XTokenWrapper address is missing')

    // Verify the CPK is defined
    const cpk = await createCpk()
    verify(!!cpk, 'Could not obtain CPK')
    cpk?.setXTokenWrapperAddress(xTokenWrapperAddress)

    const denormalizedXTokenInCpkBalance = denormalize(
      tokenIn.xToken?.cpkBalance ?? 0,
      tokenIn.decimals ?? 0,
    )

    const transferAmountIn = denormalizedXTokenInCpkBalance.lt(
      denormAmounts.exactIn,
    )
      ? denormAmounts.exactIn.minus(denormalizedXTokenInCpkBalance)
      : ZERO

    // Verify tokens approved
    verify(isUnlocked(tokenIn, transferAmountIn), 'Not enough allowance')

    if (useUtilityToken) {
      // Verify utilityToken approved
      verify(
        !!utilityToken && isUnlocked(utilityToken, denormSMTFee),
        'Not enough allowance (SMT)',
      )
    }

    // For each ERC20 token, check if the CPK has enough balance
    // if not add a transferFrom transaction to the batch of the necessary amount from the user to the CPK
    if (transferAmountIn.gt(0)) {
      cpk?.transferTokenFrom(account, tokenIn.address, transferAmountIn)

      // Approve ERC20 tokens in the CPK to be spent by the XTokenWrapper
      cpk?.approveCpkTokenFor(
        tokenIn.address,
        'erc20',
        xTokenWrapperAddress,
        transferAmountIn,
      )

      // Wrap ERC20 tokens using the XTokenWrapper
      cpk?.wrapToken(tokenIn.address, transferAmountIn)
    }

    if (useUtilityToken && utilityToken) {
      const denormalizedUtilityTokenCpkBalance = denormalize(
        utilityToken?.cpkBalance ?? 0,
        utilityToken?.decimals ?? 0,
      )
      if (denormalizedUtilityTokenCpkBalance.lte(denormSMTFee)) {
        cpk?.transferTokenFrom(
          account,
          utilityToken.address,
          denormSMTFee.minus(denormalizedUtilityTokenCpkBalance),
        )
      }
      cpk?.approveCpkTokenFor(
        utilityToken?.address || '',
        'erc20',
        bPoolProxyAddress,
        denormSMTFee,
      )
    }

    // Approve BPoolProxy to use the CPK's ERC20 xTokens
    tokens.forEach(({ xToken }, idx) =>
      cpk?.approveCpkTokenFor(
        xToken?.id || '',
        'xToken',
        bPoolProxyAddress,
        amounts[idx],
      ),
    )

    // Prepare params of smartSwapExactIn (tokenIn, tokenOut, totalAmountIn, minTokenAmountOut, nPools, useUtilityToken)
    const params = [
      tokenIn.xToken?.id,
      tokenOut.xToken?.id,
      denormalize(amountIn, tokenIn.decimals).toFixed(0),
      denormAmounts.minOut.toFixed(0),
      1,
      useUtilityToken,
    ]

    cpk?.patchTxs({
      to: bPoolProxyAddress || '',
      data: BPoolProxyInterface.encodeFunctionData('smartSwapExactIn', params),
    })

    const denormalizedXTokenOutCpkBalance = denormalize(
      tokenOut.xToken?.cpkBalance ?? 0,
      tokenOut.decimals ?? 0,
    )

    const tokenOutAmount = denormAmounts.minOut.add(
      denormalizedXTokenOutCpkBalance,
    )

    cpk?.unwrapXToken(tokenOut.xToken?.id || '', tokenOutAmount)

    cpk?.transferToken(account, tokenOut.address, tokenOutAmount)

    return cpk?.execStoredTxs()
  }
}
