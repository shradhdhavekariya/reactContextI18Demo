import { BehaviorSubject } from 'rxjs'

const walletAutoDisconnect$ = new BehaviorSubject<boolean>(true)

export const toggleWalletAutoDisconnect = (toggleValue?: boolean) => {
  const newValue =
    typeof toggleValue === 'undefined'
      ? !walletAutoDisconnect$.getValue()
      : toggleValue

  walletAutoDisconnect$.next(newValue)
}

export default walletAutoDisconnect$
