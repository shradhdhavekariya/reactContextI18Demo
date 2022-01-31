import { IStore } from 'src/shared/types/state'

const store: IStore = {
  isReady: false,
  dispatch: () => {
    throw new Error('Store not ready')
  },
}

export default store
