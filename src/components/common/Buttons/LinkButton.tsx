import { ReactNode } from 'react'
import { useHistory } from 'react-router'
import StyledButton from 'src/components/StyledButton'
import { ExtractProps } from 'src/shared/types/props'

interface LinkButtonProps extends ExtractProps<typeof StyledButton> {
  to: string
  label: ReactNode
}

const LinkButton = ({ to, label, ...props }: LinkButtonProps) => {
  const history = useHistory()
  const goTo = () => history.push(to)

  return (
    <StyledButton onClick={goTo} {...props}>
      {label}
    </StyledButton>
  )
}

export default LinkButton
