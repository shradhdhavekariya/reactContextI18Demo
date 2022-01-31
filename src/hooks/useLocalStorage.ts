import { useCallback, useEffect, useMemo, useState } from 'react'

interface LocalStorageSetItemEvent extends Event {
  key?: string
  value?: string
}

const LOCAL_STORAGE_ITEM_CHANGE = 'localStorage.itemChange'

function useLocalStorage(
  key: string,
): [string | null, (newValue: string) => void]
function useLocalStorage<T = string | null>(
  key: string,
  decode: (value: string | null) => T,
): [T, (newValue: string) => void]
function useLocalStorage<T = string | null>(
  key: string,
  decode?: (value: string | null) => T,
): [T, (newValue: string) => void] {
  const [value, setValue] = useState(localStorage.getItem(key))

  const decodedValue = useMemo(
    () => (decode ? decode(value) : ((value as unknown) as T)),
    [decode, value],
  )

  const storeValue = useCallback(
    (newValue: string) => {
      setValue(newValue)

      if (newValue === null) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, newValue)
      }

      const event: LocalStorageSetItemEvent = new Event(
        LOCAL_STORAGE_ITEM_CHANGE,
      )
      event.key = key
      event.value = newValue

      document.dispatchEvent(event)
    },
    [key],
  )

  useEffect(() => {
    const listener = (e: Event) => {
      const storageEvent = e as LocalStorageSetItemEvent
      if (storageEvent.key === key) {
        setValue(
          typeof storageEvent.value === 'undefined' ? null : storageEvent.value,
        )
      }
    }

    document.addEventListener(LOCAL_STORAGE_ITEM_CHANGE, listener)

    return () => {
      document.removeEventListener(LOCAL_STORAGE_ITEM_CHANGE, listener)
    }
  }, [key])

  return [decodedValue, storeValue]
}

export default useLocalStorage
