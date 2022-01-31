import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

const Homepage = () => {
  const history = useHistory()

  useEffect(() => {
    history.push('/swap')
  }, [history])

  return null
}

export default Homepage
