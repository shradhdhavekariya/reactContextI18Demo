import { BehaviorSubject } from 'rxjs'
import { useMemo, useCallback } from 'react'
import useObservable from './useObservable'
import { waitForValue } from '../utils/rxjs'

/**
 * @typedef {Object} PopupState
 * @property {boolean} isOpen - The state of the popup
 * @property {() => Promise<void>)} prompt - Opens the popup and resolves when it is closed
 * @property {() => void)} open - Opens the popup
 * @property {() => void)} close - Closes the popup
 */

/**
 * Provides useful helpers to deal with popups
 * In particular the method `prompt` which returns a promise and waits for the popup to close
 *
 * @param {boolean} initialState
 * @returns {PopupState}
 */
const usePopupState = (initialState = false) => {
  /**
   * This observable emits every time the popup opens or closes
   */
  const state$ = useMemo(() => new BehaviorSubject(initialState), [
    initialState,
  ])

  const isOpen = useObservable(state$, initialState)

  const open = useCallback(() => state$.next(true), [state$])
  const close = useCallback(() => state$.next(false), [state$])

  /**
   * Opens the popup (state$ emits true)
   * Then waits for it to close (when state$ emits false)
   */
  const prompt = useCallback(() => {
    open()
    return waitForValue(state$, false)
  }, [open, state$])

  return {
    isOpen,
    prompt,
    open,
    close,
  }
}

export default usePopupState
