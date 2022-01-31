import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { space, SpaceProps } from 'styled-system'

const InternalLink = styled(NavLink)<SpaceProps>`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes[2]}px;
  font-weight: ${({ theme }) => theme.fontWeights[2]};

  &:hover,
  &:active,
  &:visited {
    color: ${({ theme }) => theme.colors['primary-dark']};
  }

  ${space}
`

export default InternalLink
