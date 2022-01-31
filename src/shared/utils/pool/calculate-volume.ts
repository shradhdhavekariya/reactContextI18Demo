import Big from 'big.js'
import { Swap } from 'src/shared/types'

export const calculateVolume = <S extends Pick<Swap, 'poolTotalSwapVolume'>>(
  totalSwapVolume: string,
  swaps: S[],
): Big =>
  swaps?.[0]
    ? new Big(totalSwapVolume).minus(swaps[0].poolTotalSwapVolume)
    : new Big(totalSwapVolume)
