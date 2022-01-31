export const loadFromStorage = <T = unknown>(
  key: string,
  defaultValue?: T,
): T | undefined => {
  const stringifiedValue = localStorage.getItem(key)

  if (stringifiedValue === null || stringifiedValue === undefined) {
    return defaultValue
  }

  return JSON.parse(stringifiedValue)
}

export const saveToStorage = <T = unknown>(key: string, value: T) => {
  const stringifiedValue = JSON.stringify(value)
  localStorage.setItem(key, stringifiedValue)
}

export const removeFromStorage = (key: string) => localStorage.removeItem(key)
