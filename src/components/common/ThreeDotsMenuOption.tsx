import { SyntheticEvent } from 'react'
import styled from 'styled-components'
import { Icon, Text } from 'rimble-ui'
import Clickable from './Clickable'

interface ThreeDotsMenuOptionProps {
  label: string
  icon?: string
  color?: string
  onClick?: (event: SyntheticEvent) => void
}

const StyledButton = styled(Clickable)`
  padding: 4px 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-items: center;
  white-space: nowrap;

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors['primary-light']};
  }
`

const ThreeDotsMenuOption = ({
  label,
  icon,
  color,
  onClick,
}: ThreeDotsMenuOptionProps) => {
  return (
    <li>
      <StyledButton onClick={onClick}>
        {icon && (
          <Icon name={icon} color={color ?? 'black'} mr="6px" size="13px" />
        )}
        {label && <Text.span color={color ?? 'black'}>{label}</Text.span>}
      </StyledButton>
    </li>
  )
}

export default ThreeDotsMenuOption
