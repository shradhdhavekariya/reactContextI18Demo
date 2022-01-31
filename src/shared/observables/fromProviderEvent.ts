import { fromEvent, MonoTypeOperatorFunction, Observable } from 'rxjs'
import { share } from 'rxjs/operators'
import { readOnlyProvider } from 'src/shared/web3'

const fromProviderEvent = <T = unknown>(event: string) =>
  fromEvent(readOnlyProvider, event).pipe(
    share() as MonoTypeOperatorFunction<unknown>,
  ) as Observable<T>

export default fromProviderEvent
