import { PoolExpanded } from '../pool'

export interface LiquidityModalProps {
  pool: PoolExpanded
  isOpen?: boolean
  onClose?: () => void
  reload?: () => void
  loading?: boolean
}
