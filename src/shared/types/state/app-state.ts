import ErrorState from './error-state'
import UI from './ui'
import UserProfile from './user-profile'

interface AppState {
  initiated: boolean
  user: UserProfile
  ui: UI
  errors: ErrorState
}

export default AppState
