import { BPoolProxy } from 'src/contracts/BPoolProxy'
import { useErc20 } from './useErc20'
import useAsyncMemo from './useAsyncMemo'

export const useSmt = () => {
  const [smtAddress, { loading }] = useAsyncMemo(
    async () => BPoolProxy.getUtilityTokenAddress(),
    undefined,
    [],
  )

  const smt = useErc20(smtAddress)
  return {
    ...smt,
    loading: loading || smt.loading,
  }
}
