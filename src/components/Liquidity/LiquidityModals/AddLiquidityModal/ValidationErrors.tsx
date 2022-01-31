import { Text } from 'rimble-ui'
import { ExtractProps } from 'src/shared/types/props'
import styled from 'styled-components'
import { useFirstValidationError } from './validation'

const StyledError = styled(Text.span)`
  white-space: break-spaces;
`

const ValidationError = (props: ExtractProps<typeof Text>) => {
  const error = useFirstValidationError()

  return (
    <StyledError color="danger" {...props}>
      {error || ' '}
    </StyledError>
  )
}

export default ValidationError
