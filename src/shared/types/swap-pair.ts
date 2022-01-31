import { AbstractToken } from './tokens'

export interface SwapPair<F extends AbstractToken, T = F> {
  tokenIn?: F
  tokenOut?: T
}
