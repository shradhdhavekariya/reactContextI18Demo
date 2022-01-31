import { map } from 'lodash'
import { utils } from 'ethers'
import { BigSource } from 'big.js'
import { getCpk } from 'src/cpk'
import { getCurrentConfig } from 'src/shared/observables/configForNetwork'
import { big, denormalize } from 'src/shared/utils/big-helpers'
import { account$ } from 'src/shared/web3'
import { ExtendedPoolToken } from 'src/shared/types/tokens'
import AbstractContract from './AbstractContract'
import abi from './abi'

const { actionManagerAddress } = getCurrentConfig()

const ActionManagerInterface = new utils.Interface(abi.ActionManager)

class ActionManager extends AbstractContract {
  constructor() {
    super(actionManagerAddress, abi.ActionManager)
  }

  static getInstance = async (): Promise<ActionManager> => {
    if (!ActionManager.instances[actionManagerAddress]) {
      ActionManager.instances[actionManagerAddress] = new ActionManager()
    }
    return ActionManager.instances[actionManagerAddress]
  }

  static async createPool(
    tokens: ExtendedPoolToken[],
    amounts: BigSource[],
    weights: BigSource[],
    swapFee: BigSource,
    poolName: string,
  ) {
    const account = account$.getValue()
    const cpk = await getCpk()

    cpk?.resetStoredTxs()

    if (!account || !cpk) {
      return undefined
    }

    const denormAmounts = amounts.map((amount, idx) =>
      denormalize(amount, tokens[idx].decimals).toFixed(0),
    )

    const denormWeights = weights.map((weight) =>
      denormalize(weight, 18).toFixed(0),
    )

    const denormSwapFee = denormalize(swapFee, 18).toFixed(0)

    tokens.forEach((token, idx) => {
      if (token.cpkBalance?.lt(amounts[idx])) {
        cpk?.transferTokenFrom(
          account,
          token.address,
          denormalize(
            big(amounts[idx]).minus(token.cpkBalance),
            token.decimals,
          ),
        )
      }
    })

    tokens.forEach((token, idx) => {
      cpk?.approveCpkTokenFor(
        token.address,
        'xToken',
        actionManagerAddress,
        denormalize(amounts[idx], token.decimals),
      )
    })

    const params = [
      map(tokens, 'id'),
      denormAmounts,
      denormSwapFee,
      denormWeights,
      poolName,
    ]

    cpk?.patchTxs({
      to: actionManagerAddress || '',
      data: ActionManagerInterface.encodeFunctionData(
        'standardPoolCreation',
        params,
      ),
    })

    return cpk?.execStoredTxs()
  }
}

export default ActionManager
