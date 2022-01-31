import { KnownError } from 'src/services/error-handler'

const verify = (check: boolean, message: string, name?: string) => {
  if (!check) {
    throw new KnownError(message, { name: name || 'VerifyError' })
  }
}

export default verify
