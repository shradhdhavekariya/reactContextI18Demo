import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import Header from 'src/components/common/Header'
import { Button } from 'rimble-ui'

interface HeaderProps {
  header: string
  subheader?: string
  button?: string
}

const OnboardingHeader = ({ header, subheader, button }: HeaderProps) => {
  const history = useHistory()

  const continueLater = useCallback(() => {
    history.push('/swap')
  }, [history])

  return (
    <Header title={header} legend={subheader}>
      {button && (
        <Button.Text icon="Close" onClick={continueLater}>
          {button}
        </Button.Text>
      )}
    </Header>
  )
}

export default OnboardingHeader
