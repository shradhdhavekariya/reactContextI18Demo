import React from 'react'
import { Box } from 'rimble-ui'

interface StepIndicatorProps {
  isActive: boolean
  hide: boolean
}

const StepIndicator = ({ isActive, hide }: StepIndicatorProps) => {
  if (hide) {
    return <></>
  }
  return (
    <Box width="100%" height="6px" bg={isActive ? 'primary' : 'white'} mb={3} />
  )
}

export default StepIndicator
