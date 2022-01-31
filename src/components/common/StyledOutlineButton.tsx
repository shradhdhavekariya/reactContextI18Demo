import styled from 'styled-components'
import { Button } from 'rimble-ui'

const StyledOutlineButton = styled(Button.Outline)`
  height: 2.5rem;
  font-size: 1rem;
  padding: ${({ theme }) => `${theme.space[2]}px ${theme.space[3]}px}`};
  justify-content: flex-start;
  border: 2px solid ${({ theme }) => theme.colors.primary};
`

export default StyledOutlineButton
