import styled from 'styled-components'
import { grid } from 'styled-system'
import { Box } from 'rimble-ui'

const Grid = styled(Box)`
  display: grid;
  width: 100%;

  ${grid};
`

export default Grid
