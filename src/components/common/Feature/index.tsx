import { ReactNode, useMemo } from 'react'
import { checkFeature } from './utils'

interface FeatureProps {
  name: string
  children?: ReactNode | ReactNode[]
}

const Feature = ({ name, children }: FeatureProps) => {
  const showFeature = useMemo(() => checkFeature(name), [name])

  return showFeature && children ? <>{children}</> : null
}

export * from './utils'

export default Feature
