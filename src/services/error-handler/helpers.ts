import { ERRORS, ERROR_CODES, GENERIC_ERROR } from './consts'
import { ErrorDetails, KnownError } from './types'

export const getErrorDetails = (
  e: KnownError,
  fallback: ErrorDetails = GENERIC_ERROR,
) => {
  if (e?.code && ERROR_CODES.includes(e?.code)) {
    return {
      ...e,
      ...ERRORS[e.code],
      ...e?.details,
      description: ERRORS[e.code].description || e.message,
    }
  }

  return e.details || fallback
}
