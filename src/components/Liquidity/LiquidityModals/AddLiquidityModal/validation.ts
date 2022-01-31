import { FormikErrors, useFormikContext } from 'formik'

export const isLessThan = (max: number, message: string) => (val: number) => {
  if (val > max) return message
  return undefined
}

export const useFirstValidationError = (): string | null => {
  const { errors, isValid } = useFormikContext()

  if (isValid) {
    return null
  }

  let object = errors

  while (object) {
    const keys = Object.keys(object)
    if (typeof object[keys[0] as keyof FormikErrors<unknown>] === 'string') {
      return object[keys[0] as keyof FormikErrors<unknown>]
    }

    object = object[keys[0] as keyof FormikErrors<unknown>]
  }

  return null
}
