import { ReactNode } from 'react'

export class KnownError extends Error {
  code?: number

  details?: ErrorDetails

  constructor(message: string, details?: ErrorDetails) {
    super(message)
    this.code = details?.code
    this.details = details && {
      ...details,
      description: message,
    }
  }
}

export interface ErrorDetails {
  type?: string
  name?: string
  code?: number
  description?: string
  actionText?: ReactNode
  actionHref?: string
  actionHrefOpenInSameTab?: boolean
  autoDismissible?: boolean | number
}
