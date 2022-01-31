import { useRef, useEffect, MutableRefObject } from 'react'

const useForwardedRef = <T extends HTMLElement>(
  ref: ((instance: T | null) => void) | MutableRefObject<T | null> | null,
) => {
  const innerRef = useRef(null)

  useEffect(() => {
    if (!ref) return
    if (typeof ref === 'function') {
      ref(innerRef.current)
    } else if (ref) {
      // eslint-disable-next-line no-param-reassign
      ref.current = innerRef.current
    }
  })

  return innerRef
}

export default useForwardedRef
