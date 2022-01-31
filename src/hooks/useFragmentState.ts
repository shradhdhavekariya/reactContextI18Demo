import { useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import useAsyncState from './useAsyncState'

/**
 * This hook provides an ability to load initial state from url's hash/fragment/anchor and refresh it after state is changed
 */
export default function useFragmentState<THash extends string>(
  initState: THash,
): [THash, (newHash: THash | (() => THash)) => void] {
  const history = useHistory()
  const { location } = history
  const stateFromHash = location.hash?.substr(1) as THash
  const [state, _setState] = useAsyncState<THash>(stateFromHash || initState)

  useEffect(() => {
    if (!stateFromHash) {
      history.push({ hash: initState })
    }
  }, [history, initState, stateFromHash])

  const setState = useCallback(
    (newHash: THash | (() => THash)) => {
      history.push({ hash: newHash as string })
      _setState(newHash)
    },
    [_setState, history],
  )

  return [state, setState]
}
