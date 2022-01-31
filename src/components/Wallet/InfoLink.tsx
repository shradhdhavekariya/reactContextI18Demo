import { Link } from 'rimble-ui'
import { ExtractProps } from 'src/shared/types/props'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

const StyledNavLink = styled(NavLink)`
  color: ${({ theme }) => theme.colors.grey};
  font-weight: ${({ theme }) => theme.fontWeights[2]};
  font-size: ${({ theme }) => theme.fontSizes[2]};
  text-decoration: underline;

  &:hover {
    color: ${({ theme }) => theme.colors['dark-gray']};
  }
`

const InfoLink = ({
  internal = false,
  ...props
}: ExtractProps<typeof Link & typeof NavLink>) =>
  internal ? (
    <StyledNavLink to={props.href} {...props} />
  ) : (
    <Link
      target="_blank"
      rel="noopener noreferrer"
      color="grey"
      hoverColor="dark-gray"
      fontSize={2}
      fontWeight={2}
      style={{ textDecoration: 'underline' }}
      {...props}
    />
  )

export default InfoLink
