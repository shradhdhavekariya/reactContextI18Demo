import { ADVANCED_SETTINGS_KEY, defaultSettings } from '../consts'
import { SwapTxSettings } from '../types'

export const getStoredSettings = (): SwapTxSettings => {
  const storedStringValue = sessionStorage.getItem(ADVANCED_SETTINGS_KEY)
  if (!storedStringValue) {
    sessionStorage.setItem(
      ADVANCED_SETTINGS_KEY,
      JSON.stringify(defaultSettings),
    )

    return defaultSettings
  }

  const storedValue = JSON.parse(storedStringValue)

  return {
    ...defaultSettings,
    ...storedValue,
  }
}

export const saveSettingsPerSession = (newSettings: SwapTxSettings) =>
  sessionStorage.setItem(ADVANCED_SETTINGS_KEY, JSON.stringify(newSettings))
