import { BehaviorSubject, of } from 'rxjs'
import useObservable from 'src/shared/hooks/useObservable'

export const account$ = new BehaviorSubject<string | undefined>(undefined)

export const useAccount = (account?: string) =>
  useObservable<string | undefined>(
    account ? of(account) : account$,
    account$.getValue(),
  ) ?? undefined

export const getAccount = () => account$.getValue()
