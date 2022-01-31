import { useRef, useState, useEffect, useCallback } from 'react'
import { Action, DispatchWithThunk, Thunk } from 'src/shared/types/state'

const useAsyncReducer = <T>(
  reducer: (arg0: T, arg1: Action) => T,
  initialArg: T,
  init?: (initialArg: T) => T,
): [T, DispatchWithThunk<T>] => {
  const [state, setState] = useState<T>(init ? init(initialArg) : initialArg)

  const ref = useRef(state)
  const reducerRef = useRef(reducer)

  useEffect(() => {
    ref.current = { ...state }
  }, [state])

  const dispatch: DispatchWithThunk<T> = useCallback(
    (action: Action | Thunk<T>) => {
      if (action instanceof Function) {
        action(dispatch)
      } else {
        setState((prevState) => reducerRef.current(prevState, action))
      }
    },
    [],
  )

  return [state, dispatch]
}

export default useAsyncReducer
