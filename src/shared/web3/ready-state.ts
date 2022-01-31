import { BehaviorSubject } from 'rxjs'
import useObservable from 'src/shared/hooks/useObservable'

export const readyState$ = new BehaviorSubject<boolean | null>(false)

export const useReadyState = () => useObservable(readyState$) ?? false

export const setReady = () => readyState$.next(true)

export const getReadyState = () => readyState$.getValue()
