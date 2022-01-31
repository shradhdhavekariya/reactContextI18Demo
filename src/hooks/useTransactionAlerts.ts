import { useTranslation } from 'react-i18next'
import { TransactionResult } from 'contract-proxy-kit'
import { useNetworkId, provider$ } from 'src/shared/web3'
import { useSnackbar } from 'src/components/common/Snackbar'
import {
  AlertVariant,
  AlertSkeleton,
} from 'src/components/common/Snackbar/types'
import { generateEtherscanUrl } from 'src/utils'
import { refresh } from 'src/shared/observables/watcher'
import { providers } from 'ethers'

interface TrackerOptions {
  submit?: Partial<AlertSkeleton>
  confirm?: Partial<AlertSkeleton>
  fail?: Partial<AlertSkeleton>
  skipSubmit?: boolean
  confirmations?: number
}

const useTransactionAlerts = () => {
  const { addAlert, dismissAlert } = useSnackbar()
  const { t } = useTranslation(['transaction'])
  const networkId = useNetworkId()

  const track = async (
    tx?: TransactionResult | providers.TransactionResponse | string,
    options?: TrackerOptions,
  ) => {
    if (!tx) {
      return Promise.reject()
    }

    const hash = typeof tx === 'string' ? tx : tx.hash

    const submitKey = `TX-${hash}-SUBMIT`

    if (!options?.skipSubmit) {
      addAlert(options?.submit?.message || t('transactionSubmitted'), {
        variant: AlertVariant.success,
        actionHref: generateEtherscanUrl({
          type: 'tx',
          hash,
          chainId: networkId,
        }),
        actionText: t('view'),
        autoDismissible: false,
        key: submitKey,
        ...options?.submit,
      })
    }

    const realTx =
      typeof tx === 'string'
        ? await provider$.getValue().getTransaction(tx)
        : tx

    const response: providers.TransactionResponse =
      ((realTx as TransactionResult)
        ?.transactionResponse as providers.TransactionResponse) || realTx

    return response
      ?.wait(options?.confirmations || 1)
      .then(async () => {
        await refresh()
        addAlert(options?.confirm?.message || t('transactionConfirmed'), {
          actionHref: generateEtherscanUrl({
            type: 'tx',
            hash,
            chainId: networkId,
          }),
          actionText: t('view'),
          variant: AlertVariant.success,
          autoDismissible: 10000,
          ...options?.confirm,
        })
        dismissAlert(submitKey)
      })
      .catch(() => {
        addAlert(options?.fail?.message || t('transactionFailed'), {
          actionHref: generateEtherscanUrl({
            type: 'tx',
            hash,
            chainId: networkId,
          }),
          actionText: t('view'),
          variant: AlertVariant.error,
          autoDismissible: false,
          ...options?.fail,
        })
      })
  }

  return { track }
}

export default useTransactionAlerts
