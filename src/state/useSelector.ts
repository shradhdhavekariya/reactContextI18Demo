import { AppContext } from 'src/state/AppContext'
import { useContext, useMemo } from 'react'
import { Selector } from 'src/shared/types/state'

const useSelector = <T = unknown>(selector: Selector<T>): T => {
  const { appState } = useContext(AppContext)

  const selected = useMemo(() => selector(appState), [appState, selector])

  return useMemo(() => selected, [selected])
}

export default useSelector
