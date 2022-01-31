import { combineLatest } from 'rxjs'
import { map } from 'rxjs/operators'
import { AbstractToken } from '../types/tokens'
import balanceOf$ from './balanceOf'
import exchangeRateOf$ from './exchangeRateOf'

const userBalances$ = (account?: string | null) => (
  token: Pick<AbstractToken, 'id'>,
) =>
  combineLatest([balanceOf$(account)(token), exchangeRateOf$(0)(token)]).pipe(
    map(([balance, exchangeRate]) => ({
      native: balance?.toNumber() || 0,
      usd: balance?.times(exchangeRate || 0).toNumber() || 0,
    })),
  )

export default userBalances$
