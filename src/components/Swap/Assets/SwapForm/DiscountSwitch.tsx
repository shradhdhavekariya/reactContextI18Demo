import { Dispatch, SetStateAction, useContext, useEffect, useMemo } from 'react'
import Big from 'big.js'
import AngledSwitch from 'src/components/common/AngledSwitch'
import { ExtendedPoolToken } from 'src/shared/types/tokens'
import useAsyncMemo from 'src/hooks/useAsyncMemo'
import { SmtPriceFeed } from 'src/contracts/SmtPriceFeed'
import { AlertVariant } from 'src/components/common/Snackbar/types'
import { useSnackbar } from 'src/components/common/Snackbar'
import { SwapContext } from '../../SwapContext'

interface DiscountSwitchProps {
  checked: boolean
  setChecked: Dispatch<SetStateAction<boolean>>
  feeAmount: Big
  utilityToken?: ExtendedPoolToken
}

const DiscountSwitch = ({
  checked,
  setChecked,
  utilityToken,
  feeAmount,
}: DiscountSwitchProps) => {
  const {
    tokenIn,
    settings: { autoPaySmtDiscount },
  } = useContext(SwapContext)
  const { addAlert } = useSnackbar()

  const toggleDiscount = () => setChecked((prev) => !prev)

  const [isDiscountAvailable] = useAsyncMemo(
    async () => {
      if (tokenIn?.xToken?.id) {
        const assetPrice = await SmtPriceFeed.getPrice(tokenIn.xToken.id)
        return assetPrice.gt(0)
      }

      return autoPaySmtDiscount
    },
    autoPaySmtDiscount,
    [tokenIn?.xToken?.id],
  )

  useEffect(() => {
    if (!isDiscountAvailable && checked) {
      setChecked(false)
    }
  }, [isDiscountAvailable, checked, setChecked])

  useEffect(() => {
    if (autoPaySmtDiscount && isDiscountAvailable) {
      setChecked(true)
    }
  }, [autoPaySmtDiscount, isDiscountAvailable, setChecked])

  useEffect(() => {
    if (!autoPaySmtDiscount) {
      setChecked(false)
    }
  }, [autoPaySmtDiscount, isDiscountAvailable, setChecked])

  useEffect(() => {
    if (
      checked &&
      utilityToken?.balance &&
      feeAmount.gt(utilityToken.balance)
    ) {
      setChecked(false)

      if (utilityToken?.balance.eq(0)) {
        addAlert('Not enough SMT for protocol fee', {
          variant: AlertVariant.warning,
        })
      }
    }
  }, [checked, setChecked, utilityToken?.balance, feeAmount, addAlert])

  const isDiscountDisabled = useMemo(
    () =>
      !(
        isDiscountAvailable &&
        utilityToken?.balance &&
        feeAmount.lt(utilityToken.balance)
      ),
    [isDiscountAvailable, utilityToken?.balance, feeAmount],
  )

  return (
    <AngledSwitch
      disabled={isDiscountDisabled}
      checked={checked}
      onChange={toggleDiscount}
    />
  )
}

export default DiscountSwitch
