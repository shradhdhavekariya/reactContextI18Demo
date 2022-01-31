import { uniqBy } from 'lodash'
import { BRegistry } from 'src/contracts/BRegistry'
import useAsyncMemo from 'src/hooks/useAsyncMemo'
import { XToken } from 'src/shared/types/tokens'

const useBestPool = (from?: XToken, to?: XToken) =>
  useAsyncMemo(
    async () => {
      if (!from?.id || !to?.id) return null

      const fromTokenPools =
        from?.poolTokens?.map((poolToken) => poolToken?.poolId) || []
      const toTokenPools =
        to?.poolTokens?.map((poolToken) => poolToken?.poolId) || []

      const pools = uniqBy([...fromTokenPools, ...toTokenPools], 'id').filter(
        ({ publicSwap }) => !!publicSwap,
      )

      const poolAddress = await BRegistry.getBestPoolAddress(from?.id, to?.id)

      return pools.find(({ id }) => id?.toLowerCase() === poolAddress) || null
    },
    null,
    [from, to],
  )

export default useBestPool
