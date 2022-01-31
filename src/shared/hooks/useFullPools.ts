import { useMemo } from 'react'
import { map, switchMap } from 'rxjs/operators'
import { combineLatest, from } from 'rxjs'
import { XTokenWrapper } from 'src/contracts/XTokenWrapper'
import { useCpk } from 'src/cpk'
import { BPoolProxy } from 'src/contracts/BPoolProxy'
import useAsyncMemo from 'src/hooks/useAsyncMemo'
import exchangeRateOf$ from '../observables/exchangeRateOf'
import useArrayInjector from './useArrayInjector'
import { PoolExpanded } from '../types'
import { poolTokenToToken } from '../utils'
import balanceOf$ from '../observables/balanceOf'

const useFullPools = (pools?: PoolExpanded[]) => {
  const cpk = useCpk()
  const [xTokenWrapperAddress] = useAsyncMemo(
    async () => BPoolProxy.getXTokenWrapperAddress(),
    null,
    [],
  )

  return useArrayInjector<PoolExpanded>(
    useMemo(
      () => ({
        ...(xTokenWrapperAddress && {
          cpkBalance: (pool) =>
            from(XTokenWrapper.tokenToXToken(pool.id)).pipe(
              switchMap((xPoolTokenAddress: string) =>
                balanceOf$(cpk?.address)({
                  id: xPoolTokenAddress,
                }),
              ),
            ),
        }),
        tokens: (pool) =>
          combineLatest(
            pool.tokens
              .map(poolTokenToToken)
              .map((token) =>
                exchangeRateOf$(0)(token).pipe(
                  map((exchangeRate) => ({ ...token, exchangeRate })),
                ),
              ),
          ),
      }),
      [cpk?.address, xTokenWrapperAddress],
    ),
    useMemo(() => pools || [], [pools]),
  )
}

export default useFullPools
