import { useMemo } from 'react'
import { of, Observable, combineLatest } from 'rxjs'
import {
  distinctUntilChanged,
  map,
  shareReplay,
  switchMap,
} from 'rxjs/operators'
import Big from 'big.js'
import { Erc20 } from 'src/contracts/ERC20'
import balanceOf$ from 'src/shared/observables/balanceOf'
import { compareAllowanceWithBalance } from 'src/shared/utils'
import { AbstractToken } from '../types/tokens'
import { AllowanceStatus } from '../enums'
import useObservable from '../hooks/useObservable'
import { normalize } from '../utils/big-helpers'
import { observeCall } from './watcher'

export const getAllowanceCacheKey = (
  account: string,
  spenderAddress: string,
  id: string,
) =>
  `allowance_${account.toLowerCase()}_${spenderAddress.toLowerCase()}_${id.toLowerCase()}`

const allowanceOf$ = (account?: string | null, spenderAddress?: string) => ({
  id,
}: Pick<AbstractToken, 'id'>): Observable<Big | null | undefined> => {
  if (!account || !spenderAddress) {
    return of(undefined)
  }

  const key = getAllowanceCacheKey(account, spenderAddress, id)

  const decimalsPromise = Erc20.getDecimals(id)

  return observeCall(
    id,
    ['allowance(address,address)(uint256)', account, spenderAddress],
    key,
  ).pipe(
    switchMap((value) =>
      value
        ? decimalsPromise.then((decimals) =>
            normalize(value.toString(), decimals),
          )
        : of(null),
    ),
  )
}

export const useAllowanceOf = (
  account?: string | null,
  spenderAddress?: string,
  tokenAddress?: string,
) =>
  useObservable(
    useMemo(
      () =>
        tokenAddress
          ? allowanceOf$(account, spenderAddress)({ id: tokenAddress })
          : of(undefined),
      [account, spenderAddress, tokenAddress],
    ),
  )

export const allowanceStatusOf$ = (
  account?: string | null,
  spenderAddress?: string,
) => ({
  id,
}: Pick<AbstractToken, 'id'>): Observable<
  AllowanceStatus | undefined | null
> => {
  return combineLatest([
    balanceOf$(account)({ id }),
    allowanceOf$(account, spenderAddress)({ id }),
  ]).pipe(
    map(
      ([balance, allowance]) =>
        balance && allowance && compareAllowanceWithBalance(balance, allowance),
    ),
    distinctUntilChanged(),
    shareReplay(1),
  )
}

export const useAllowanceStatusOf = (
  account?: string | null,
  spenderAddress?: string,
  tokenAddress?: string,
) =>
  useObservable(
    useMemo(
      () =>
        tokenAddress
          ? allowanceStatusOf$(account, spenderAddress)({ id: tokenAddress })
          : of(undefined),
      [account, spenderAddress, tokenAddress],
    ),
  )

export default allowanceOf$
