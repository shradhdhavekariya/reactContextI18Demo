import { ErrorResponse, ResponseError } from 'src/shared/types/api-responses'

export function isError(error: ResponseError | unknown): error is Error {
  const casted = error as ResponseError
  return !!casted.title && !!casted.code && !!casted.status
}

export function isErrorResponse(
  response: ErrorResponse | unknown,
): response is ErrorResponse {
  const casted = response as ErrorResponse
  return !!casted.errors.length && casted.errors.every(isError)
}
