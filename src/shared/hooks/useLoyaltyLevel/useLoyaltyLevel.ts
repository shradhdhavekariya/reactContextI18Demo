import { useCpk } from 'src/cpk'
import { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { UserQuery } from 'src/queries'
import { useSmt } from 'src/hooks/useSmt'
import useAsyncMemo from 'src/hooks/useAsyncMemo'
import { SmtDistributor } from 'src/contracts/SmtDistributor'
import { POLL_INTERVAL } from 'src/shared/consts/time'
import { ZERO } from 'src/shared/utils/big-helpers'
import { propEquals } from 'src/shared/utils/collection/filters'
import { useCpkAddress } from 'src/state/hooks'
import { LOYALTY_LEVELS } from './consts'
import { getLoyaltyLevel } from './helpers'
import { SharesOwnedType } from './types'
import useLoyaltyLevelTokens from './useLoyaltyLevelTokens'

const useLoyaltyLevel = (selectedAddress: string) => {
  const cpk = useCpk()
  const cpkAddress = useCpkAddress(selectedAddress) ?? cpk?.address

  const { data: pooledData } = useQuery(UserQuery, {
    variables: {
      id: cpkAddress?.toLowerCase(),
    },
    skip: !cpkAddress,
    fetchPolicy: 'no-cache',
    pollInterval: POLL_INTERVAL,
  })

  const { tokens: fullTokens, loading: tokensLoading } = useLoyaltyLevelTokens(
    selectedAddress,
  )

  const {
    balanceOfCurrentUser: smtUserBalance,
    exchangeRate: smtPrice,
    address: smtAddress,
  } = useSmt()

  const [claimableSmt] = useAsyncMemo(
    async () => SmtDistributor.getClaimableAmount(selectedAddress),
    ZERO,
    [selectedAddress],
  )

  const smtSummaryBalance = useMemo(
    () => claimableSmt.add(smtUserBalance || 0),
    [smtUserBalance, claimableSmt],
  )

  const { pooledTokenBalance, loading: balanceLoading } = useMemo(() => {
    if (!pooledData || !fullTokens?.length)
      return { pooledTokenBalance: 0, loading: true }
    const sharedPoolsBalances = pooledData?.user?.sharesOwned.map(
      (sharesOwned: SharesOwnedType) => {
        const temp =
          sharesOwned.poolId.tokens.map((item) => {
            const newToken = fullTokens.find(
              propEquals('symbol', item.xToken.token.symbol),
            )

            return Number((newToken?.exchangeRate || 0) * Number(item.balance))
          }) || 0

        const sum = temp && temp.reduce((x: number, y: number) => x + y, 0)

        return (
          (Number(sharesOwned.balance) * sum) /
          Number(sharesOwned.poolId.totalShares)
        )
      },
    )

    return {
      pooledTokenBalance:
        sharedPoolsBalances?.reduce((x: number, y: number) => x + y, 0) || 0,
      loading: false,
    }
  }, [fullTokens, pooledData])

  const smtToken = useMemo(
    () => fullTokens.find(propEquals('address', smtAddress)),
    [fullTokens, smtAddress],
  )

  const pooledSMTTokenBalance = useMemo(() => {
    const shares = pooledData?.user?.sharesOwned
    const xSmtAddress = smtToken?.xToken?.id

    if (!shares?.length || !xSmtAddress) {
      return 0
    }

    return pooledData.user.sharesOwned
      .filter((share: SharesOwnedType) =>
        share.poolId.tokens.find(propEquals('address', xSmtAddress)),
      )
      .reduce((acc: number, share: SharesOwnedType) => {
        const poolSmtBalance = Number(
          share.poolId.tokens.find(propEquals('address', xSmtAddress))
            ?.balance || 0,
        )

        return (
          acc +
          (Number(share.balance || 0) * poolSmtBalance) /
            Number(share.poolId.totalShares)
        )
      }, 0)
  }, [pooledData?.user?.sharesOwned, smtToken?.xToken?.id])

  const levelData = useMemo(() => {
    const smtBalance = Number(smtSummaryBalance) + pooledSMTTokenBalance
    const smtExchangePrice = smtPrice || 0

    const value = getLoyaltyLevel(
      smtBalance,
      smtExchangePrice,
      pooledTokenBalance,
    )

    return {
      level: LOYALTY_LEVELS[value],
      value,
      smtBalance: Number(smtSummaryBalance),
      pooledTokenBalance: pooledTokenBalance || 0,
    }
  }, [pooledTokenBalance, pooledSMTTokenBalance, smtPrice, smtSummaryBalance])

  return {
    ...levelData,
    loading: tokensLoading || !pooledData || balanceLoading,
  }
}

export default useLoyaltyLevel
