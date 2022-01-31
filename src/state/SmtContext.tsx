import React, { createContext, useMemo } from 'react'
import { useSmt } from 'src/hooks/useSmt'
import useAsyncMemo from 'src/hooks/useAsyncMemo'
import { SmtDistributor } from 'src/contracts/SmtDistributor'
import { ZERO } from 'src/shared/utils/big-helpers'
import { useAccount } from 'src/shared/web3'
import { ChildrenProps } from 'src/shared/types'

interface TokenBalance {
  erc20: number
  usd: number
}

export interface SmtContextType {
  smtBalance: {
    wallet: TokenBalance
    unclaimed: TokenBalance & { reload: () => Promise<void> }
    total: TokenBalance
    balanceLoading: boolean
    claimInProgress: boolean
    setClaimInProgress: (claimInProgress: boolean) => void
  }
  price: number
}

export const SmtContext = createContext<SmtContextType>({
  smtBalance: {
    wallet: {
      erc20: 0,
      usd: 0,
    },
    unclaimed: {
      erc20: 0,
      usd: 0,
      reload: async () => {},
    },
    total: {
      erc20: 0,
      usd: 0,
    },
    balanceLoading: true,
    claimInProgress: false,
    setClaimInProgress: () => {},
  },
  price: 0,
})

export const SmtContextProvider = ({ children }: ChildrenProps) => {
  const [claimInProgress, setClaimInProgress] = React.useState(false)
  const account = useAccount()
  const {
    balanceOfCurrentUser: smtWalletBalance = ZERO,
    exchangeRate: smtPrice = 0,
    loading: smtLoading,
  } = useSmt()

  const [
    claimableSmt,
    {
      loading: reloadingSmtClaimableBalance,
      reload: reloadSmtClaimableBalance,
    },
  ] = useAsyncMemo(
    async () => SmtDistributor.getClaimableAmount(account),
    ZERO,
    [account],
  )

  const smtSummaryBalance = useMemo(
    () =>
      claimInProgress
        ? smtWalletBalance ?? ZERO
        : claimableSmt.add(smtWalletBalance ?? 0),
    [smtWalletBalance, claimableSmt, claimInProgress],
  )

  const totalSmtBalance = useMemo<TokenBalance>(
    () => ({
      erc20: smtSummaryBalance.toNumber(),
      usd: smtSummaryBalance.times(smtPrice || 0).toNumber(),
    }),
    [smtSummaryBalance, smtPrice],
  )

  return (
    <SmtContext.Provider
      value={{
        smtBalance: {
          wallet: {
            erc20: smtWalletBalance?.toNumber() || 0,
            usd: smtWalletBalance?.times(smtPrice ?? 0).toNumber() || 0,
          },
          unclaimed: {
            erc20: claimableSmt.toNumber(),
            usd: claimableSmt.times(smtPrice || 0).toNumber(),
            reload: reloadSmtClaimableBalance,
          },
          total: totalSmtBalance,
          balanceLoading: smtLoading || reloadingSmtClaimableBalance,
          claimInProgress,
          setClaimInProgress,
        },
        price: Number(smtPrice),
      }}
    >
      {children}
    </SmtContext.Provider>
  )
}
