import { Link } from 'rimble-ui'

import styled from 'styled-components'

const ButtonLink = styled(Link)`
  display: inline-flex;
  text-decoration: none;
  text-align: center;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 3rem;
  min-width: 3rem;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 0;
  padding-bottom: 0;
  font-size: inherit;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
    background: none;
    box-shadow: none;
    color: ${({ color = 'primary', theme }) => theme.colors[color]};
  }
  &:active,
  &:visited {
    text-decoration: none;
    color: ${({ color = 'primary', theme }) => theme.colors[color]};
  }
`

export default ButtonLink
