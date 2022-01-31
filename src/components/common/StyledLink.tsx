import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

const StyledLink = styled(NavLink)`
  font-size: ${({ theme }) => theme.fontSizes[2]};
  font-weight: ${({ theme }) => theme.fontWeights[4]};
  line-height: ${({ theme }) => theme.lineHeights.copy};
  color: ${({ theme }) => theme.colors['text-rare']};

  &:hover,
  &:active {
    color: ${({ theme }) => theme.colors['primary-dark']};
  }
`

export default StyledLink
