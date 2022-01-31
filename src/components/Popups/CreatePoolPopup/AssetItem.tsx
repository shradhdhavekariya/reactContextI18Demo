import React, { useCallback, useContext, useMemo } from 'react'
import styled from 'styled-components'
import { Text, Box } from 'rimble-ui'
import { useTranslation } from 'react-i18next'
import { map } from 'lodash'
import { useField } from 'formik'
import { propNotIn } from 'src/shared/utils/collection/filters'
import { ReactComponent as CloseIconSVG } from 'src/assets/icons/Close.svg'
import { useAccount } from 'src/shared/web3'
import { useBalanceOf } from 'src/shared/observables/balanceOf'
import { prettifyBalance } from 'src/shared/utils'
import { useExchangeRateOf } from 'src/shared/observables/exchangeRateOf'
import TokenSelect from 'src/components/common/TokenSelect'
import { BalancePresenter } from 'src/components/common/Balance'
import { CreatePoolContext } from './CreatePoolContext'
import CustomInput from './CustomInput'
import { NewPoolAsset } from './types'

const Container = styled.div`
  position: relative;
  padding: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const CloseIcon = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;

  svg {
    width: 13px;
    height: 13px;
  }
`

const Values = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-row-gap: 20px;
  margin-top: 10px;
  gap: ${({ theme }) => `${theme.space[1]}px`};

  @media (min-width: ${({ theme }) => theme.breakpoints[1]}) {
    grid-template-columns: 1fr 1fr 1fr;
    grid-row-gap: 20px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints[2]}) {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  }
`

interface AssetItemProps {
  showRemoveButton: boolean
  index: number
  onRemove: () => void
  onChange: (newAsset: NewPoolAsset) => void
}

const AssetItem = ({
  showRemoveButton = false,
  index,
  onRemove,
  onChange,
}: AssetItemProps) => {
  const { t } = useTranslation('pools')
  const account = useAccount()

  const [idField, , idHelper] = useField<string>({
    name: `assets.${index}.id`,
  })

  const balance = useBalanceOf(account, idField.value)
  const exchangeRate = useExchangeRateOf(idField.value)

  const { values, nativeTokens, getTokenById, totalWeight } = useContext(
    CreatePoolContext,
  )

  const [weightField, weightMeta, weightHelper] = useField<string>({
    name: `assets.${index}.weight`,
  })
  const [amountField, amountMeta, amountHelper] = useField<string>({
    name: `assets.${index}.amount`,
    validate: (value) =>
      balance && value && balance?.lt(value ?? 0)
        ? 'Amount exceeds balance'
        : undefined,
  })

  const weightPercentage = useMemo(
    () =>
      100 * (totalWeight ? (Number(weightField.value) ?? 0) / totalWeight : 0),
    [totalWeight, weightField.value],
  )

  const totalValue = useMemo(
    () => (exchangeRate ?? 0) * (Number(amountField.value) ?? 0),
    [amountField.value, exchangeRate],
  )

  const tokenOptions = useMemo(
    () =>
      nativeTokens
        .filter(propNotIn('id', map(values.assets, 'id')))
        .map(({ id, symbol }) => ({
          value: id,
          label: symbol.toLocaleUpperCase(),
        })),
    [nativeTokens, values.assets],
  )

  const selectedOption = useMemo(() => {
    const native = getTokenById(idField.value)

    if (native) {
      return {
        id: idField.value,
        value: native.name,
        label: native.symbol.toLocaleUpperCase(),
      }
    }

    return undefined
  }, [getTokenById, idField.value])

  const onAmountChangeCallback = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const amount = e.target.value

      amountHelper.setValue(amount)
      onChange?.({
        id: idField.value,
        amount,
        weight: weightField.value,
      })
    },
    [amountHelper, idField.value, onChange, weightField.value],
  )

  const onWeightChangeCallback = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const weight = e.target.value

      weightHelper.setValue(weight)
      onChange?.({
        id: idField.value,
        amount: amountField.value,
        weight,
      })
    },
    [amountField.value, idField.value, onChange, weightHelper],
  )

  const onIdChangeCallback = useCallback(
    (e: { value: string; label: string } | null) => {
      if (e) {
        idHelper.setValue(e.value)
        onChange?.({
          id: e.value,
          amount: amountField.value,
          weight: weightField.value,
        })
      }
    },
    [amountField.value, idHelper, onChange, weightField.value],
  )

  return (
    <Container>
      <TokenSelect
        options={tokenOptions}
        value={selectedOption}
        onChange={onIdChangeCallback}
      />
      {showRemoveButton && (
        <CloseIcon onClick={onRemove}>
          <CloseIconSVG />
        </CloseIcon>
      )}
      <Values>
        <Box className="value-item" mx={1} overflow="hidden">
          <Text color="grey" fontWeight={4} mb={2}>
            {t('createPool.assets.myBalance')}
          </Text>
          <Text.span
            color="black"
            display="inline-block"
            overflow="hidden"
            width="100%"
            style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={balance}
          >
            <BalancePresenter balance={balance} />
          </Text.span>
        </Box>
        <div className="value-item">
          <Text color="grey" fontWeight={4} mb={1}>
            {t('createPool.assets.weight')}
          </Text>
          <CustomInput
            {...weightField}
            type="number"
            height="36px"
            p="10px 24px 10px 8px"
            width="97px"
            fontWeight={5}
            boxShadow="none"
            bg="white"
            currentValue={weightField.value}
            onChange={onWeightChangeCallback}
            error={weightMeta.touched && weightMeta.error}
          />
        </div>
        <div className="value-item">
          <Text color="grey" fontWeight={4} mb={2}>
            {t('createPool.assets.percent')}
          </Text>
          <Text color="black" title={weightPercentage}>
            {prettifyBalance(weightPercentage)}%
          </Text>
        </div>
        <div className="value-item">
          <Text color="grey" fontWeight={4} mb={1}>
            {t('createPool.assets.amount')}
          </Text>
          <CustomInput
            {...amountField}
            type="number"
            height="36px"
            p="10px 24px 10px 8px"
            width="97px"
            fontWeight={5}
            boxShadow="none"
            bg="white"
            currentValue={amountField.value}
            onChange={onAmountChangeCallback}
            error={amountMeta.touched && amountMeta.error}
          />
        </div>
        <div className="value-item">
          <Text color="grey" fontWeight={4} mb={2}>
            {t('createPool.assets.price')}
          </Text>
          <Text.span color="black" title={exchangeRate}>
            ${exchangeRate ? prettifyBalance(exchangeRate) : '--'}
          </Text.span>
        </div>
        <div className="value-item">
          <Text color="grey" fontWeight={4} mb={2}>
            {t('createPool.assets.totalValue')}
          </Text>
          <Text.span color="black" title={totalValue}>
            ${prettifyBalance(totalValue)}
          </Text.span>
        </div>
      </Values>
    </Container>
  )
}

export default AssetItem
