import match from 'conditional-expression'
import AddLiquidityModal from 'src/components/Liquidity/LiquidityModals/AddLiquidityModal'
import RemoveLiquidityModal from 'src/components/Liquidity/LiquidityModals/RemoveLiquidityModal'
import { usePoolDetails } from 'src/shared/hooks'
import { PoolExpanded } from 'src/shared/types'
import { LiquidityActionType } from 'src/shared/types/props'

interface LiquidityModalsProps {
  openModal: LiquidityActionType | ''
  onClose: (modal: 'add' | 'remove') => void
  reload?: () => void
  loading?: boolean
  pool: string | PoolExpanded
}

const LiquidityModals = ({
  openModal,
  onClose,
  loading = false,
  reload,
  pool,
}: LiquidityModalsProps) => {
  const {
    pool: loadedPool,
    loading: loadedPoolLoading,
    refetch,
  } = usePoolDetails(openModal && typeof pool === 'string' ? pool : undefined)

  const concretePool = (typeof pool === 'string'
    ? loadedPool
    : pool) as PoolExpanded

  const concreteReload = () => {
    refetch()
    reload?.()
  }

  return (
    !!concretePool &&
    match(openModal)
      .equals('add')
      .then(
        <AddLiquidityModal
          isOpen
          onClose={() => onClose('add')}
          pool={concretePool}
          reload={concreteReload}
          loading={loading || loadedPoolLoading || !concretePool}
        />,
      )
      .equals('remove')
      .then(
        <RemoveLiquidityModal
          isOpen
          onClose={() => onClose('remove')}
          pool={concretePool}
          reload={concreteReload}
          loading={loading || loadedPoolLoading || !concretePool}
        />,
      )
      .else(null)
  )
}

export default LiquidityModals
