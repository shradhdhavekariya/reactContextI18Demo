import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

/**
 * This one hook only updates state if the component that called this hook is mounted. This allows us to avoid memory leaks.
 * @param {*} initialState
 * @param {boolean} [initFlag]
 */
const useAsyncState = <S extends unknown>(
  initialState: S | (() => S),
  initFlag = true,
): [S, Dispatch<SetStateAction<S>>] => {
  const [state, _setState] = useState<S>(initialState)
  const isNotCancelled = useRef(initFlag)

  useEffect(
    () => () => {
      isNotCancelled.current = false
    },
    [],
  )

  const setState = useCallback(
    (newState) => isNotCancelled.current && _setState(newState),
    [_setState],
  )

  return [state, setState]
}

export default useAsyncState
