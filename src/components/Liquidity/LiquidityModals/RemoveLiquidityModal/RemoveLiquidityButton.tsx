import Big, { BigSource } from 'big.js'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader } from 'rimble-ui'
import { ExtendedPoolToken } from 'src/shared/types/tokens'
import { BPoolProxy } from 'src/contracts/BPoolProxy'
import { useSnackbar } from 'src/components/common/Snackbar'
import SmartButton from 'src/components/common/Buttons/SmartButton'
import useTransactionAlerts from 'src/hooks/useTransactionAlerts'
import { PoolExpanded } from 'src/shared/types'
import { TRANSACTION_RELOAD_DELAY } from 'src/shared/consts/time'
import config from 'src/environment'
import autoRound from 'src/shared/utils/math/autoRound'
import { Tier } from 'src/shared/enums'
import { useAccount } from 'src/shared/web3'

const { faq: faqLink } = config.resources.docs.gettingStarted

interface RemoveLiquidityButtonProps {
  multiple: boolean
  loading?: boolean
  selectedOption?: ExtendedPoolToken
  pool: PoolExpanded
  amountOut: BigSource
  reload?: () => void
  setTransactionLoading: (val: boolean) => void
}

const RemoveLiquidityButton = ({
  pool,
  reload,
  multiple,
  loading,
  selectedOption,
  amountOut,
  setTransactionLoading,
}: RemoveLiquidityButtonProps) => {
  const account = useAccount()
  const { t } = useTranslation(['liquidityModals', 'navigation'])
  const { addError } = useSnackbar()
  const { track } = useTransactionAlerts()

  const poolTokensToRedeem = useMemo(() => new Big(amountOut), [amountOut])

  const disabled = poolTokensToRedeem.eq(0) || loading

  const reportError = useCallback(
    (e: Error) =>
      addError(e, {
        description: t('errors:transactionGeneric'),
        actionText: 'faqs',
        actionHref: faqLink,
      }),
    [addError, t],
  )

  const handleRemoveLiquidity = useCallback(async () => {
    if (!account) {
      return
    }
    setTransactionLoading(true)

    try {
      const tx = await BPoolProxy.exitPool(
        account,
        pool,
        multiple ? pool.tokens : (selectedOption as ExtendedPoolToken),
        poolTokensToRedeem,
      )

      if (tx) {
        track(tx, {
          confirm: {
            secondaryMessage: t('addSuccess', {
              amount: autoRound(poolTokensToRedeem),
            }),
          },
        })

        await tx?.transactionResponse?.wait()

        setTimeout(() => reload?.(), TRANSACTION_RELOAD_DELAY)
      }
    } catch (e) {
      reportError(e)
    } finally {
      setTransactionLoading(false)
    }
  }, [
    setTransactionLoading,
    account,
    pool,
    multiple,
    selectedOption,
    poolTokensToRedeem,
    track,
    t,
    reload,
    reportError,
  ])

  return (
    <SmartButton
      requireInitiated
      requireAccount
      requireTier={Tier.tier1}
      mr={3}
      disabled={disabled}
      loading={loading}
      onClick={handleRemoveLiquidity}
      loadingText={
        <>
          <Loader mr={2} color="white" />
          {t('remove.header')}
        </>
      }
    >
      {t('remove.header')}
    </SmartButton>
  )
}

export default RemoveLiquidityButton
