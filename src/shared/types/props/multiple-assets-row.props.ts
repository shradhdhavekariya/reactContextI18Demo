import { ExtendedPoolToken } from '../tokens'

export interface MultipleAssetsRowProps {
  checked?: boolean
  value?: number
  onSelect: (token: ExtendedPoolToken | 'all') => void
  onChange?: (value: number) => void
  disabled?: boolean
}
