import React from 'react'
import { Box, Text } from 'rimble-ui'
import { Icon } from '@rimble/icons'

interface StepDurationProps {
  legend: string
}

const StepDuration = ({ legend }: StepDurationProps) => {
  return (
    <Box height="40px" display="flex" alignItems="center">
      <Icon name="AccessTime" color="grey" />
      <Text.span color="grey" fontWeight={3} ml="10px">
        {legend}
      </Text.span>
    </Box>
  )
}

export default StepDuration
