import { Link } from 'rimble-ui'
import styled from 'styled-components'

const AlertLink = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes[2]}px;
  font-weight: ${({ theme }) => theme.fontWeights[4]};
  line-height: ${({ theme }) => theme.lineHeights.copy};
  color: ${({ theme }) => theme.colors['text-rare']};
  text-decoration: underline;
  &:hover,
  &:active {
    color: ${({ theme }) => theme.colors['primary-dark']};
  }
`

export default AlertLink
