import { useCallback, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader } from 'rimble-ui'
import SmartButton from 'src/components/common/Buttons/SmartButton'
import { useCpk } from 'src/cpk'
import { isLocked } from 'src/shared/utils/tokens/allowance'
import { Tier } from 'src/shared/enums'
import useTransactionAlerts from 'src/hooks/useTransactionAlerts'
import { useSnackbar } from 'src/components/common/Snackbar'
import { CreatePoolContext } from './CreatePoolContext'

const CreatePoolButton = () => {
  const { t } = useTranslation(['pools', 'common'])
  const cpk = useCpk()
  const { values, errors, getTokenById, submit, loading } = useContext(
    CreatePoolContext,
  )
  const { addError } = useSnackbar()
  const { track } = useTransactionAlerts()

  const assets = useMemo(
    () =>
      values.assets.map(({ id, weight, amount }) => ({
        ...getTokenById(id),
        weight,
        amount,
      })),
    [getTokenById, values.assets],
  )

  const hasError = Object.keys(errors).length !== 0

  const lockedToken = useMemo(
    () =>
      loading
        ? undefined
        : assets.find((token) => token.amount && isLocked(token, token.amount)),
    [loading, assets],
  )

  const disabled = !lockedToken && (hasError || assets.length === 0)

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
      addError(e)
    }
  }, [
    addError,
    cpk?.address,
    lockedToken?.contract,
    lockedToken?.name,
    t,
    track,
  ])

  const handleClick = useCallback(async () => {
    if (lockedToken) {
      return unlock()
    }
    return submit()
  }, [lockedToken, submit, unlock])

  return (
    <SmartButton
      requireInitiated
      requireAccount
      requireTier={Tier.tier2}
      size="medium"
      px={3}
      mt={4}
      disabled={disabled}
      loading={loading}
      onClick={handleClick}
      loadingText={
        <>
          <Loader mr={2} color="white" />
          {lockedToken
            ? t('common:token.unlocking', { token: lockedToken.symbol })
            : t('pools:createPool.advanced.create')}
        </>
      }
    >
      {lockedToken
        ? t('common:token.unlock', { token: lockedToken.symbol })
        : t('pools:createPool.advanced.create')}
    </SmartButton>
  )
}

export default CreatePoolButton
