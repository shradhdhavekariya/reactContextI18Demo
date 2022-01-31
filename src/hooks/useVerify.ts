import { useCallback, useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { AppContext } from 'src/state/AppContext'
import { login, register } from 'src/state/actions/users'
import { disconnectWallet, getAccount, getSigner } from 'src/shared/web3'
import api from 'src/services/api'
import { useSnackbar } from 'src/components/common/Snackbar'
import { AlertVariant } from 'src/components/common/Snackbar/types'
import { timeLimit } from 'src/shared/utils/promise/index'

const MAX_SIGNING_WAIT_TIME = 60000

const useVerify = () => {
  const { t } = useTranslation(['onboarding'])
  const [loading, setLoading] = useState<boolean>(false)
  const { addAlert } = useSnackbar()
  const { dispatch } = useContext(AppContext)

  const verify = useCallback(async () => {
    const account = getAccount()

    if (!account) {
      addAlert(t('verifyAddress.noAccount'), {
        variant: AlertVariant.error,
      })
      disconnectWallet()
      return
    }

    const signer = getSigner()

    if (!signer) {
      addAlert(t('verifyAddress.noSigner'), {
        variant: AlertVariant.error,
      })
      disconnectWallet()
      return
    }

    setLoading(true)

    try {
      const exists = await api.checkExistence(account)

      if (exists) {
        const {
          attributes: { message },
        } = await api.nonceMessage(account)

        const signedMessage = await timeLimit(
          signer.signMessage(message),
          MAX_SIGNING_WAIT_TIME,
        )

        dispatch(login(account, signedMessage))
      } else {
        const {
          attributes: { message },
        } = await api.nonceMessage(account, 'Terms and Conditions')

        const signedMessage = await signer.signMessage(message)

        dispatch(register(account, signedMessage))
      }
    } catch (e: unknown) {
      if ((e as Error).message === 'timeout') {
        disconnectWallet()
      }

      addAlert(t('verifyAddress.error'), {
        variant: AlertVariant.warning,
      })
    } finally {
      setLoading(false)
    }
  }, [addAlert, dispatch, t])

  return {
    verify,
    loading,
  }
}

export default useVerify
