import { useCallback } from 'react'
import useIsComponentMounted from './useIsComponentMounted'

const useSafeCallback = <ARGS extends unknown[], RET>(
  callback?: (...args: ARGS) => RET,
) => {
  const mounted = useIsComponentMounted()

  return useCallback(
    (...args: ARGS) => {
      if (mounted.current) {
        return callback?.(...args)
      }

      return new Promise(() => {})
    },
    [callback, mounted],
  )
}

export default useSafeCallback
