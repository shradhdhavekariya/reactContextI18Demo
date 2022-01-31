import { defer, iif, of } from 'rxjs'
import {
  distinctUntilChanged,
  shareReplay,
  startWith,
  switchMap,
  mergeMap,
  takeWhile,
} from 'rxjs/operators'
import { cpk$, getCpk } from 'src/cpk'
import useObservable from '../hooks/useObservable'
import { onEveryBlock$ } from '../web3'

const proxyDeployed$ = defer(() =>
  cpk$.pipe(
    switchMap((cpk) => cpk?.isProxyDeployed() ?? of(false)),
    distinctUntilChanged(),
    mergeMap((val) =>
      iif(
        () => !val,
        onEveryBlock$.pipe(
          switchMap(() => getCpk()?.isProxyDeployed() ?? of(false)),
          distinctUntilChanged(),
          takeWhile((v) => !v),
        ),
        of(val),
      ),
    ),
    startWith(false),
    shareReplay(1),
  ),
)

export const useIsProxyDeployed = () => useObservable(proxyDeployed$, false)

export default proxyDeployed$
