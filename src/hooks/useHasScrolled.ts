import { useEffect, useState } from 'react'

interface UseHasScrolledOptions {
  active?: boolean
}

const useHasScrolled = ({ active = true }: UseHasScrolledOptions) => {
  const [hasScrolled, setHasScrolled] = useState(active && !!window.scrollY)

  useEffect(() => {
    let isNotCancelled = true

    const handler = () => {
      if (isNotCancelled) {
        setHasScrolled(!!window.scrollY)
      }
    }

    if (active) {
      window.addEventListener('scroll', handler)
    } else {
      window.removeEventListener('scroll', handler)
    }

    return () => {
      isNotCancelled = false
      window.removeEventListener('scroll', handler)
    }
  }, [active])

  return active && hasScrolled
}

export default useHasScrolled
