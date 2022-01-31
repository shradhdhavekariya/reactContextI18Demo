import { components } from 'react-select'
import { Text } from 'rimble-ui'
import React from 'react'
import styled from 'styled-components'
import { ExtractProps } from '../../../shared/types/props'

const StyledSelected = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  svg {
    width: 20px;
    height: 20px;
    min-width: 20px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints?.[1]}) {
    .selected-option-label {
      display: none;
    }
  }
`

export const SingleValue = (
  props: ExtractProps<typeof components.SingleValue>,
) => {
  const { data } = props

  return (
    <components.SingleValue {...props}>
      {' '}
      <StyledSelected>
        {data.icon}
        <Text ml={[2, '10px']} mr="4px" className="selected-option-label">
          {data.label}
        </Text>
      </StyledSelected>
    </components.SingleValue>
  )
}
