import styled from 'styled-components'
import { Button, Input } from 'rimble-ui'

export const FromInput = styled(Input)`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.grey};
  box-shadow: none;
  color: ${({ theme }) => theme.colors.black};
  height: 36px;
  font-weight: ${({ theme }) => theme?.fontWeights[5]};
  text-align: right;
  width: 100%;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  @media (min-width: ${({ theme }) => theme?.breakpoints[0]}) {
    height: 48px;
  }
`

export const FlipButton = styled(Button.Text)`
  padding: 0;
  height: auto;
  width: auto;
  min-width: auto;
  border-radius: 50%;
`
