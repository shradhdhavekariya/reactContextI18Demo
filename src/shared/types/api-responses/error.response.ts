export interface ResponseError {
  title: string
  detail: string
  status: string
  code: string
  meta: {
    error: string
    error_info: string
  }
}
export interface ErrorResponse {
  errors: ResponseError[]
}
