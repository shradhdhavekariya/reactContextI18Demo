import { ToggleButtonOption } from '../types/toggle-button-option'

export const MAX_SAFE_SLIPPAGE = 10

export const transactionToleranceOptions: ToggleButtonOption[] = [
  {
    value: 0.1,
    label: '0.1%',
  },
  {
    value: 0.5,
    label: '0.5%',
  },
  {
    value: 1,
    label: '1%',
  },
  {
    value: null,
    custom: true,
  },
]

export const defaultSettings = {
  tolerance: 1,
  autoPaySmtDiscount: true,
}

export const ADVANCED_SETTINGS_KEY = 'advanced-settings'
