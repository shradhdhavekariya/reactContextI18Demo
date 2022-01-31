import { useEffect, useState, useCallback } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Request = (...args: unknown[]) => Promise<any>

type UnwrapPromise<P> = P extends PromiseLike<infer T> ? T : never

interface UseRequestReturnType<T extends Request> {
  data: null | UnwrapPromise<ReturnType<T>>
  loading: boolean
  ready: boolean
  error: null | unknown
  refetch: (...args: Parameters<T>) => void
}

const useRequest = <T extends Request>(
  request: T,
  params?: Parameters<T>,
): UseRequestReturnType<T> => {
  const [loading, setLoading] = useState(true)
  const [ready, setReady] = useState(false)
  const [data, setData] = useState<null | UnwrapPromise<ReturnType<T>>>(null)
  const [error, setError] = useState(null)

  const refetch = useCallback(
    (...args: Parameters<T> | unknown[]) => {
      setLoading(true)
      request(...args)
        .then((res) => {
          setData(res)
          setLoading(false)
          setReady(true)
        })
        .catch(setError)
    },
    [request],
  )

  useEffect(() => {
    refetch(...(params || []))
  }, [params, refetch])

  return {
    data,
    loading,
    error,
    refetch,
    ready,
  }
}

export default useRequest
