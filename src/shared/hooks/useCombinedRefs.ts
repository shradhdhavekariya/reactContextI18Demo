import { useRef, useEffect, MutableRefObject } from 'react'

type ForwardedRef<T> =
  | ((instance: T | null) => void)
  | MutableRefObject<T | null>
  | null

const useCombinedRefs = <T = unknown>(...refs: ForwardedRef<T>[]) => {
  const targetRef = useRef<T>(null)

  useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return

      if (typeof ref === 'function') {
        ref(targetRef.current)
      } else {
        // eslint-disable-next-line no-param-reassign
        ref.current = targetRef.current
      }
    })
  }, [refs])

  return targetRef
}

export default useCombinedRefs
