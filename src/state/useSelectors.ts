import { AppContext } from 'src/state/AppContext'
import { useContext, useMemo } from 'react'
import { Selector } from 'src/shared/types/state'

const useSelectors = (selectors: { [k: string]: Selector<unknown> }) => {
  const { appState } = useContext(AppContext)

  const selected = useMemo(() => {
    return Object.keys(selectors).reduce(
      (values, key) => ({
        ...values,
        [key]: selectors[key](appState),
      }),
      {} as { [k in keyof typeof selectors]: ReturnType<typeof selectors[k]> },
    )
  }, [appState, selectors])

  return useMemo(() => selected, [selected])
}

export default useSelectors
