import React from 'react'
import { Card, Heading, Box, Text } from 'rimble-ui'
import { ReactComponent as WalletIcon } from 'src/assets/icons/Wallet.svg'
import { ReactComponent as PassportIcon } from 'src/assets/icons/Passport.svg'
import { ReactComponent as EmailIcon } from 'src/assets/icons/Mail.svg'
import { ReactComponent as CompletedIcon } from 'src/assets/icons/Completed.svg'
import { ReactComponent as WalletCheckedIcon } from 'src/assets/icons/WalletChecked.svg'
import { Color } from 'src/theme'
import styled from 'styled-components'

import StepIndicator from './StepIndicator'

const Icon = styled.div`
  height: 30px;
  display: flex;
  align-items: center;
`

interface OverviewCardProps {
  title: string
  description: string
  stepNumber: string
  stepCompleted: boolean
  isActive: boolean
  children?: React.ReactNode
}

const OverviewCard = ({
  title,
  description,
  stepNumber,
  stepCompleted,
  isActive,
  children,
}: OverviewCardProps) => {
  const renderIcon = () => {
    if (stepCompleted) {
      return <CompletedIcon height="30px" fill={Color.primary} />
    }

    if (stepNumber === '1') {
      return <WalletIcon height="30px" fill={Color.primary} />
    }

    if (stepNumber === '2') {
      return <WalletCheckedIcon height="40px" fill={Color.primary} />
    }

    if (stepNumber === '3') {
      return <PassportIcon height="30px" fill={Color.primary} />
    }

    if (stepNumber === '4') {
      return <EmailIcon height="20px" fill={Color.primary} />
    }

    return <></>
  }

  return (
    <Card
      p="24px"
      borderRadius={1}
      boxShadow={2}
      display="flex"
      flexDirection="column"
      opacity={stepCompleted ? 0.5 : 1}
    >
      <StepIndicator isActive={isActive} hide={false} />
      <Icon>{renderIcon()}</Icon>
      <Heading mt="10px" mb={0} fontWeight={5}>
        {stepNumber}. {title}
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

export default OverviewCard
