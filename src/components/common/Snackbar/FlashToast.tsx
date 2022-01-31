import { useState } from 'react'
import { useSnackbar } from 'src/components/common/Snackbar'
import { AlertSkeleton } from 'src/components/common/Snackbar/types'
import useEffectCompare from 'src/shared/hooks/useEffectCompare'

interface FlashToastProps extends AlertSkeleton {
  display: boolean
  once?: boolean
}

const FlashToast = ({
  display,
  once = false,
  message,
  ...options
}: FlashToastProps) => {
  const { addAlert } = useSnackbar()
  const [alreadyDisplayed, setAlreadyDisplayed] = useState(false)

  useEffectCompare(() => {
    if (display && !alreadyDisplayed) {
      addAlert(message, options)
      setAlreadyDisplayed(once)
    }
  }, [display])

  return null
}

export default FlashToast
