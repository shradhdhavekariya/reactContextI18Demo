import { of } from 'rxjs'
import { switchMap, distinctUntilChanged } from 'rxjs/operators'
import api from 'src/services/api'
import { account$ } from 'src/shared/web3'

const isAccountRegistered$ = () =>
  account$.pipe(
    distinctUntilChanged(),
    switchMap((account) => (account ? api.checkExistence(account) : of(false))),
    distinctUntilChanged(),
  )

export default isAccountRegistered$
