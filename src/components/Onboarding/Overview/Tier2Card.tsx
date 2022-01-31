import React from 'react'
import { Card, Heading, Box, Text } from 'rimble-ui'
import StepIndicator from './StepIndicator'

interface Tier2CardProps {
  title: string
  description: string
  children: React.ReactNode
  icon?: React.ReactNode
  iconColor?: string
  isActive?: boolean
  step?: number
  hideIndicator?: boolean
  stepCompleted?: boolean
}

const Tier2Card = ({
  title,
  description,
  icon,
  iconColor = 'primary',
  isActive,
  step,
  children,
  hideIndicator,
  stepCompleted,
}: Tier2CardProps) => {
  return (
    <Card
      p="24px"
      borderRadius={1}
      boxShadow={2}
      display="flex"
      flexDirection="column"
      maxWidth="323px"
      minHeight="300px"
    >
      <StepIndicator
        isActive={isActive || false}
        hide={hideIndicator || (step ? step > 7 : false)}
      />
      <Heading
        mt="10px"
        mb={0}
        fontWeight={5}
        display="flex"
        alignItems="flexStart"
        opacity={stepCompleted ? 0.5 : 1}
      >
        {icon && (
          <Box
            width="32px"
            height="32px"
            bg={iconColor}
            display="inline-flex"
            flex="0 0 32px"
            borderRadius="50%"
            justifyContent="center"
            alignItems="center"
            mr={3}
          >
            {icon}
          </Box>
        )}
        {title}
      </Heading>

      <Box
        flexGrow="1"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Text color="text-light" mt="24px" mb={3}>
          {description}
        </Text>
        {children}
      </Box>
    </Card>
  )
}

export default Tier2Card
