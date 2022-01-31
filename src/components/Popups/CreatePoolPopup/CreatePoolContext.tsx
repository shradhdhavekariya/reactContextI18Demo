import { createContext, useCallback, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router'
import { map, sumBy } from 'lodash'
import { Formik, FormikErrors, useFormikContext } from 'formik'
import { propEquals, propNotIn } from 'src/shared/utils/collection/filters'
import { useNativeTokens } from 'src/hooks/subgraph'
import { useAccount, useReadyState } from 'src/shared/web3'
import { ExtendedPoolToken } from 'src/shared/types/tokens'
import { ChildrenProps } from 'src/shared/types'
import ActionManager from 'src/contracts/ActionManager'
import {
  injectCpkAllowance,
  injectBalance,
  useInjections,
  injectContract,
  injectExchangeRate,
} from 'src/shared/utils/tokens/injectors'
import useTransactionAlerts from 'src/hooks/useTransactionAlerts'
import { useCpk } from 'src/cpk'
import { POLL_INTERVAL } from 'src/shared/consts/time'
import { allowancesLoading } from 'src/shared/utils/tokens/allowance'
import { balancesLoading } from 'src/shared/utils/tokens/balance'
import { useSnackbar } from 'src/components/common/Snackbar'
import { DEFAULT_TOKEN_WEIGHT, newPoolInitialValues } from './consts'
import { validate } from './validation'
import { NewPoolSchema } from './types'

export interface CreatePoolContextType {
  values: NewPoolSchema
  errors: FormikErrors<NewPoolSchema>
  nativeTokens: ExtendedPoolToken[]
  getTokenById: (id: string) => ExtendedPoolToken | undefined
  totalWeight: number
  addToken: () => void
  submit: () => Promise<void>
  loading: boolean
}

export const CreatePoolContext = createContext<CreatePoolContextType>({
  values: newPoolInitialValues,
  errors: {},
  nativeTokens: [],
  getTokenById: () => undefined,
  totalWeight: 0,
  addToken: () => {},
  submit: () => Promise.resolve(),
  loading: true,
})

const CreatePoolManager = ({ children }: ChildrenProps) => {
  const account = useAccount()
  const cpk = useCpk()
  const ready = useReadyState()
  const history = useHistory()
  const { track } = useTransactionAlerts()
  const { addError } = useSnackbar()

  const {
    values,
    errors,
    setFieldValue,
    resetForm,
    validateForm,
  } = useFormikContext<NewPoolSchema>()
  const totalWeight = useMemo(
    () => sumBy(values.assets, (asset) => Number(asset.weight || 0)),
    [values.assets],
  )

  const { nativeTokens, loading } = useNativeTokens<ExtendedPoolToken>({
    skip: !ready,
    variables: { filter: { symbol_not: 'SPT' } },
    pollInterval: POLL_INTERVAL,
  })

  const fullTokens = useInjections<ExtendedPoolToken>(
    nativeTokens,
    useMemo(
      () => [
        injectBalance(account),
        injectBalance(cpk?.address, 'cpkBalance'),
        injectCpkAllowance(account),
        injectContract(),
        injectExchangeRate(),
      ],
      [account, cpk?.address],
    ),
  )

  const areAllowancesLoading = useMemo(
    () =>
      allowancesLoading(
        fullTokens.filter(
          ({ id }) => !!values.assets.find(propEquals('id', id)),
        ),
        account,
        cpk?.address,
      ),
    [fullTokens, account, cpk?.address, values.assets],
  )

  const areBalancesLoading = useMemo(
    () =>
      balancesLoading(
        fullTokens.filter(
          ({ id }) => !!values.assets.find(propEquals('id', id)),
        ),
        account,
      ),
    [account, fullTokens, values.assets],
  )

  const dictionary = useMemo(() => {
    const dic = new Map<string, ExtendedPoolToken>()
    fullTokens.forEach((token) => dic.set(token.id.toLowerCase(), token))
    return dic
  }, [fullTokens])

  const getTokenById = useCallback(
    (id: string) => dictionary.get(id.toLowerCase()),
    [dictionary],
  )

  useEffect(() => {
    if (!values.assets.length && fullTokens.length > 2) {
      setFieldValue(
        'assets',
        fullTokens.slice(0, 2).map(({ id }) => ({ id, amount: 0, weight: 1 })),
        false,
      )
    } else if (values.assets.length) {
      validateForm()
    }
  }, [fullTokens, setFieldValue, validateForm, values.assets.length])

  const addToken = useCallback(() => {
    const firstRemainingToken = fullTokens.filter(
      propNotIn('id', map(values.assets, 'id')),
    )?.[0]

    if (firstRemainingToken) {
      setFieldValue(
        'assets',
        [
          ...values.assets,
          {
            id: firstRemainingToken.id,
            weight: DEFAULT_TOKEN_WEIGHT,
            amount: 0,
          },
        ],
        false,
      )
    }
  }, [fullTokens, setFieldValue, values.assets])

  const submit = useCallback(async () => {
    const assets = values.assets.map(
      ({ id }) => fullTokens.find(propEquals('id', id)) as ExtendedPoolToken,
    )

    const amounts = map(values.assets, 'amount')
    const weights = map(values.assets, 'weight')
    const poolName = `SM Pool: ${map(assets, 'symbol').join('-')}`

    try {
      const tx = await ActionManager.createPool(
        assets,
        amounts,
        weights,
        values.swapFee,
        poolName,
      )

      track(tx)

      await tx?.transactionResponse?.wait()

      resetForm()

      history.push('/pools/my-pools')
    } catch (e) {
      addError(e)
    }
  }, [
    addError,
    fullTokens,
    history,
    resetForm,
    track,
    values.assets,
    values.swapFee,
  ])

  return (
    <CreatePoolContext.Provider
      value={{
        nativeTokens: fullTokens,
        getTokenById,
        totalWeight,
        addToken,
        values,
        errors,
        submit,
        loading: loading || areAllowancesLoading || areBalancesLoading,
      }}
    >
      {children}
    </CreatePoolContext.Provider>
  )
}

export const CreatePoolContextProvider = ({ children }: ChildrenProps) => {
  return (
    <Formik
      initialValues={newPoolInitialValues}
      onSubmit={() => {}}
      validate={validate}
    >
      <CreatePoolManager>{children}</CreatePoolManager>
    </Formik>
  )
}
