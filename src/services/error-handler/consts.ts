import { ErrorDetails } from './types'

export const ERROR_CODES: number[] = [4001]

export const ERRORS: Record<number, ErrorDetails> = {
  4001: {
    code: 4001,
    type: 'MetaMask',
    name: 'UserRejectionError',
  },
}

export const GENERIC_ERROR = {
  type: 'generic',
  description: 'Something went wrong, please try again!',
}
