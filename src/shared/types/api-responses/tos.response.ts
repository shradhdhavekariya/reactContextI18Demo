import BaseResponse from './base.response'

interface ToSAttributes {
  pdf_html: string
  pdf_link: string
  yes_link: string
  pdf_name: string
}

type ToSResponse = BaseResponse<ToSAttributes>

export default ToSResponse
