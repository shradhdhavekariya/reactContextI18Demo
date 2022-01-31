import { useState, useLayoutEffect } from 'react'
import { Observable } from 'rxjs'

function useObservable<T>(
  observable$: Observable<T> | (() => Observable<T> | undefined),
): T | undefined
function useObservable<T, U extends T = T>(
  observable$: Observable<T> | (() => Observable<T> | undefined),
  init: U,
): T | U
function useObservable<T, U>(
  observable$: Observable<T> | (() => Observable<T> | undefined),
  init?: U,
): T | U | undefined {
  const [state, setState] = useState<T | U | undefined>(init)

  useLayoutEffect(() => {
    const concreteObservable =
      observable$ instanceof Function ? observable$() : observable$
    const subscription = concreteObservable?.subscribe(setState)

    return () => {
      subscription?.unsubscribe()
    }
  }, [observable$])

  return state
}

export default useObservable
