import { useTranslation } from 'react-i18next'
import FlashToast from 'src/components/common/Snackbar/FlashToast'
import { AlertVariant } from 'src/components/common/Snackbar/types'
import { FORBIDDEN_TIERS } from 'src/shared/consts/tiers'
import useDeepMemo from 'src/hooks/useDeepMemo'
import { useAccount } from 'src/shared/web3'
import { useTier } from 'src/state/hooks'

const TransactionForbidden = () => {
  const account = useAccount()
  const { t } = useTranslation('alerts')
  const tier = useTier()
  const display = useDeepMemo(() => FORBIDDEN_TIERS.includes(tier), [
    account,
    tier,
  ])

  return (
    <FlashToast
      display={display}
      message={t('transactionForbidden')}
      variant={AlertVariant.warning}
    />
  )
}

export default TransactionForbidden
