import { BigNumber } from 'ethers'
import { combineLatest } from 'rxjs'
import { map, startWith } from 'rxjs/operators'
import { AbstractToken } from '../types/tokens'
import balanceOf$ from './balanceOf'
import exchangeRateOf$ from './exchangeRateOf'

const usdBalanceOf$ = (
  account?: string | null,
  initialValue?: BigNumber | number,
) => (token: Pick<AbstractToken, 'id'>) =>
  combineLatest({
    balance: balanceOf$(account)(token),
    exchangeRate: exchangeRateOf$(0)(token),
  }).pipe(
    map(
      ({ balance, exchangeRate }) =>
        balance?.times(Number(exchangeRate || 0)) || 0,
    ),
    startWith(initialValue),
  )

export default usdBalanceOf$
