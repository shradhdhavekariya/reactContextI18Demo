import { useMemo } from 'react'
import { Loader, Box } from 'rimble-ui'
import Big from 'big.js'
import { of } from 'rxjs'
import { prettifyBalance } from 'src/shared/utils'
import useObservable from 'src/shared/hooks/useObservable'
import balanceOf$ from 'src/shared/observables/balanceOf'
import { useExchangeRates } from 'src/services/exchange-rates'
import { balanceLoading } from 'src/shared/utils/tokens/balance'
import { useAccount } from 'src/shared/web3'

interface BalanceProps {
  tokenAddress?: string
  account?: string | null
  usd?: boolean
  symbol?: string
  base?: number
}

const Balance = ({
  tokenAddress,
  account,
  usd = false,
  symbol,
  base = 6,
}: BalanceProps) => {
  const balance = useObservable(
    useMemo(
      () =>
        tokenAddress
          ? balanceOf$(account)({ id: tokenAddress })
          : of(undefined),
      [account, tokenAddress],
    ),
  )

  const exchangeRates = useExchangeRates(tokenAddress ? [tokenAddress] : [])

  if (typeof balance === 'undefined') {
    return <>--</>
  }

  if (balanceLoading({ balance }, account)) {
    return (
      <Box display="inline-block">
        <Loader m={0} />
      </Box>
    )
  }

  if (usd && tokenAddress) {
    const exchangeRate =
      exchangeRates[tokenAddress] && exchangeRates[tokenAddress].exchangeRate

    if (exchangeRate === null) {
      return (
        <Box display="inline-block">
          <Loader m={0} />
        </Box>
      )
    }

    return (
      <>
        {prettifyBalance(balance?.times(exchangeRate || 0) || 0, base)} {symbol}
      </>
    )
  }

  return (
    <>
      {prettifyBalance(balance || 0, base)} {symbol}
    </>
  )
}

interface BalancePresenterProps {
  balance?: Big | null
  account?: string
  base?: number
  symbol?: string
}

export const BalancePresenter = ({
  balance,
  account,
  base = 0,
  symbol = '',
}: BalancePresenterProps) => {
  const connectedAccount = useAccount(account)

  if (typeof balance === 'undefined') {
    return <>--</>
  }

  if (balanceLoading({ balance }, connectedAccount)) {
    return (
      <Box display="inline-block">
        <Loader m={0} />
      </Box>
    )
  }

  return (
    <>
      {prettifyBalance(balance || 0, base)} {symbol}
    </>
  )
}

export default Balance
