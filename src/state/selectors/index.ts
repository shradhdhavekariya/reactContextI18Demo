import { AppState, Selector } from 'src/shared/types/state'

export * from './app'
export * from './user'

export const composeSelectors = <T extends Selector<unknown>[]>(
  ...selectors: T
) => (state: AppState) => selectors.map((selector) => selector(state))
