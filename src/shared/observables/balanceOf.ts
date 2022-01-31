import { useMemo } from 'react'
import Big from 'big.js'
import { Observable, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { Erc20 } from 'src/contracts/ERC20'
import { AbstractToken } from '../types/tokens'
import useObservable from '../hooks/useObservable'
import { normalize } from '../utils/big-helpers'
import { observeCall } from './watcher'

/**
 * Returns an observable that emits
 * * undefined if no account
 * * null if balance is being loaded
 * * the last balance of the token (Big)
 *
 * @param account
 */
const balanceOf$ = (account?: string | null) => ({
  id,
}: Pick<AbstractToken, 'id'>): Observable<Big | null | undefined> => {
  if (!account) {
    return of(undefined)
  }

  const key = `balance_${account.toLowerCase()}_${id.toLowerCase()}`

  const decimalsPromise = Erc20.getDecimals(id)

  return observeCall(id, ['balanceOf(address)(uint256)', account], key).pipe(
    switchMap((value) =>
      value
        ? decimalsPromise.then((decimals) =>
            normalize(value.toString(), decimals),
          )
        : of(null),
    ),
  )
}

export default balanceOf$

export const useBalanceOf = (account?: string | null, tokenAddress?: string) =>
  useObservable(
    useMemo(
      () =>
        tokenAddress
          ? balanceOf$(account)({ id: tokenAddress })
          : of(undefined),
      [account, tokenAddress],
    ),
  )
