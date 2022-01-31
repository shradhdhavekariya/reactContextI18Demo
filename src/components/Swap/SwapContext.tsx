import { createContext } from 'react'
import {
  INITIAL_SWAP_QUERY_RESULT,
  SwapsQueryResult,
} from 'src/shared/hooks/useSwaps'
import { SwapPair, SwapTxSettings } from 'src/shared/types'
import { ExtendedPoolToken } from 'src/shared/types/tokens'
import { defaultSettings } from 'src/shared/consts'

export interface SwapContextType {
  tokenIn?: ExtendedPoolToken
  tokenOut?: ExtendedPoolToken
  setTokenPair: (pair: SwapPair<ExtendedPoolToken>) => void
  settings: SwapTxSettings
  setSwapSettings: (newSettings: SwapTxSettings) => void
  swaps: SwapsQueryResult
}

export const SwapContext = createContext<SwapContextType>({
  setTokenPair: () => {},
  setSwapSettings: () => {},
  settings: defaultSettings,
  swaps: INITIAL_SWAP_QUERY_RESULT,
})
