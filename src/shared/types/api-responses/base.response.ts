interface BaseResponse<T> {
  id?: string
  type?: string
  attributes: T
}

export default BaseResponse
