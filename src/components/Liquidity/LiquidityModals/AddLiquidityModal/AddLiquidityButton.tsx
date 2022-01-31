import Big, { BigSource } from 'big.js'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader } from 'rimble-ui'
import { useFormikContext } from 'formik'
import { Tier } from 'src/shared/enums'
import SmartButton from 'src/components/common/Buttons/SmartButton'
import { useSnackbar } from 'src/components/common/Snackbar'
import { PoolExpanded } from 'src/shared/types'
import { ExtendedPoolToken } from 'src/shared/types/tokens'
import {
  calcSingleTokenAmountInByPoolAmountOut,
  calcTokenAmountInByPoolAmountOut,
} from 'src/shared/utils/pool-calc'
import { BPoolProxy } from 'src/contracts/BPoolProxy'
import useTransactionAlerts from 'src/hooks/useTransactionAlerts'
import { TRANSACTION_RELOAD_DELAY } from 'src/shared/consts/time'
import config from 'src/environment'
import autoRound from 'src/shared/utils/math/autoRound'
import { BALANCE_BUFFER } from 'src/shared/consts'
import { useCpk } from 'src/cpk'
import { useAccount } from 'src/shared/web3'
import { allowancesLoading, isLocked } from 'src/shared/utils/tokens/allowance'
import { wrap } from 'src/shared/utils/collection/wrap'
import { AddLiquidityValues } from './types'

const { faq: faqLink } = config.resources.docs.gettingStarted

interface AddLiquidityButtonProps {
  multiple: boolean
  loading?: boolean
  selectedOption?: ExtendedPoolToken
  pool: PoolExpanded
  amountOut: BigSource
  reload?: () => void
  setTransactionLoading: (val: boolean) => void
}

const getAmountIn = (
  amountOut: BigSource,
  pool: PoolExpanded,
  token: ExtendedPoolToken,
  multiple: boolean,
  tolerance = BALANCE_BUFFER,
) => {
  return multiple
    ? calcTokenAmountInByPoolAmountOut(pool, amountOut, token, tolerance)
    : calcSingleTokenAmountInByPoolAmountOut(pool, amountOut, token, tolerance)
}

const AddLiquidityButton = ({
  multiple,
  selectedOption,
  pool,
  amountOut,
  reload,
  loading = false,
  setTransactionLoading,
}: AddLiquidityButtonProps) => {
  const { t } = useTranslation(['common', 'liquidityModals', 'onboarding'])
  const account = useAccount()
  const cpk = useCpk()

  const { addError } = useSnackbar()
  const { track } = useTransactionAlerts()

  const { isValid } = useFormikContext<AddLiquidityValues>()

  const tokensToCheckAllowance = useMemo(
    () => (multiple ? pool.tokens : wrap(selectedOption)),
    [multiple, pool.tokens, selectedOption],
  )

  const areAllowancesLoading = useMemo(
    () => allowancesLoading(tokensToCheckAllowance, account),
    [account, tokensToCheckAllowance],
  )

  const lockedToken = useMemo(
    () =>
      areAllowancesLoading
        ? undefined
        : tokensToCheckAllowance.find((token) =>
            isLocked(token, getAmountIn(amountOut, pool, token, multiple)),
          ),
    [amountOut, areAllowancesLoading, multiple, pool, tokensToCheckAllowance],
  )

  const reportError = useCallback(
    (e: Error) =>
      addError(e, {
        description: t('errors:transactionGeneric'),
        actionText: 'faqs',
        actionHref: faqLink,
      }),
    [addError, t],
  )

  const unlock = useCallback(async () => {
    try {
      const tx = await lockedToken?.contract?.enableToken(cpk?.address || '')

      track(tx, {
        confirm: {
          secondaryMessage: t('common:token.unlocked', {
            token: lockedToken?.name,
          }),
        },
      })
      await tx?.wait()
    } catch (e) {
      reportError(e)
    }
  }, [
    lockedToken?.contract,
    lockedToken?.name,
    cpk?.address,
    track,
    t,
    reportError,
  ])

  const addLiquidity = useCallback(async () => {
    if (!account) {
      return
    }

    try {
      const tx = await BPoolProxy.joinPool(
        account,
        pool,
        multiple ? pool.tokens : (selectedOption as ExtendedPoolToken),
        amountOut,
      )

      setTransactionLoading(true)

      if (tx) {
        track(tx, {
          confirm: {
            secondaryMessage: t('addSuccess', {
              amount: autoRound(amountOut),
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
    account,
    amountOut,
    multiple,
    pool,
    reload,
    reportError,
    selectedOption,
    setTransactionLoading,
    t,
    track,
  ])

  const handleClick = useCallback(async () => {
    if (lockedToken) {
      return unlock()
    }
    return addLiquidity()
  }, [addLiquidity, lockedToken, unlock])

  return (
    <SmartButton
      requireInitiated
      requireAccount
      requireTier={Tier.tier1}
      mr={3}
      disabled={
        loading ||
        areAllowancesLoading ||
        (!lockedToken && new Big(amountOut).eq(0)) ||
        !isValid
      }
      loading={loading || areAllowancesLoading}
      onClick={handleClick}
      loadingText={
        <>
          <Loader mr={2} color="white" />
          {lockedToken
            ? t('common:token.unlocking', { token: lockedToken.symbol })
            : t('add.header')}
        </>
      }
    >
      {lockedToken
        ? t('common:token.unlock', { token: lockedToken.symbol })
        : t('add.header')}
    </SmartButton>
  )
}

export default AddLiquidityButton
