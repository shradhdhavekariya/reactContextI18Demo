import { useEffect, useMemo } from 'react'
import ReactDOM from 'react-dom'

interface PortalProps {
  children: React.ReactNode
  lockScroll?: boolean
}

const Portal = ({ children, lockScroll }: PortalProps) => {
  const root = useMemo(() => document.createElement('div'), [])

  useEffect(() => {
    document.body.append(root)

    if (lockScroll) {
      document.body.style.overflowY = 'hidden'
    }

    return () => {
      document.body.removeChild(root)
      document.body.style.overflowY = 'auto'
    }
  }, [lockScroll, root])

  return ReactDOM.createPortal(children, root)
}

export default Portal
