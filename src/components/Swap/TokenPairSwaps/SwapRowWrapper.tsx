import styled from 'styled-components'
import { Box } from 'rimble-ui'

const SwapRowWrapper = styled(Box)`
  display: grid;
  grid-template-columns: 2fr 4fr 0.5fr 4fr 2fr;
  grid-template-rows: 1fr;
  gap: 0px 16px;
  grid-template-areas: '. . . . .';
  align-items: center;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors['light-gray']};
  padding: ${({ theme }) => `12px ${theme.space[2]}px`};

  & > span {
    min-width: 0;
    overflow: hidden;
  }
`

export default SwapRowWrapper
