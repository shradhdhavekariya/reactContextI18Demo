import { useMemo } from 'react'
import { getAuthToken } from '../utils'

const useAuth = () => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const token = useMemo(() => getAuthToken(), [localStorage.length])
  return { token, isAuthorized: !!token }
}

export default useAuth
