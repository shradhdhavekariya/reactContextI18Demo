import { FormikErrors } from 'formik'
import { set, sumBy } from 'lodash'
import {
  isBetween,
  isLessThan,
  isGreaterThan,
} from 'src/shared/utils/big-helpers'
import {
  MAX_FEE,
  MIN_FEE,
  MIN_WEIGHT,
  MAX_WEIGHT,
  MAX_TOTAL_WEIGHT,
  MIN_BALANCE,
} from './consts'
import { NewPoolSchema } from './types'

const validateField = <T>(
  value: T,
  validator: (value: T) => boolean,
  msg: string,
) => (validator(value) ? undefined : msg)

const addError = (
  errors: FormikErrors<NewPoolSchema>,
  path: string,
  error: string | undefined,
) => {
  if (error) {
    return set(errors, path, error)
  }

  return errors
}

export const validate = (values: NewPoolSchema) => {
  let errors: FormikErrors<NewPoolSchema> = {}

  errors = addError(
    errors,
    'swapFee',
    validateField(
      values.swapFee,
      isBetween(MIN_FEE, MAX_FEE),
      `Swap fee should be between ${MIN_FEE.times(
        100,
      ).toString()}% and ${MAX_FEE.times(100).toString()}%`,
    ),
  )

  errors = addError(
    errors,
    `assets`,
    validateField(
      sumBy(values.assets, (asset) => Number(asset.weight || 0)),
      isLessThan(MAX_TOTAL_WEIGHT),
      `Total weight should be less than ${MAX_TOTAL_WEIGHT.toString()}`,
    ),
  )

  values.assets.forEach((asset, idx) => {
    errors = addError(
      errors,
      `assets[${idx}].weight`,
      validateField(
        asset.weight,
        isBetween(MIN_WEIGHT, MAX_WEIGHT),
        `Weight should be between ${MIN_WEIGHT.toString()} and ${MAX_WEIGHT.toString()}`,
      ),
    )

    errors = addError(
      errors,
      `assets[${idx}].amount`,
      validateField(
        asset.amount,
        isGreaterThan(MIN_BALANCE),
        `Amount should be at least ${MIN_BALANCE.toString()}`,
      ),
    )
  })

  return errors
}
