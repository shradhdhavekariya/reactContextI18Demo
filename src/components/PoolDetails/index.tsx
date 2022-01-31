import { SyntheticEvent, useCallback, useMemo } from 'react'
import { useHistory } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Box, Button, Card, Loader } from 'rimble-ui'
import { big, ZERO } from 'src/shared/utils/big-helpers'
import { PoolExpanded } from 'src/shared/types'
import { PoolType } from 'src/shared/enums'
import { calculateMarketCap, calculateVolume } from 'src/shared/utils/pool'
import useFragmentState from 'src/hooks/useFragmentState'
import { NativeToken } from 'src/shared/types/tokens'
import Divider from 'src/components/common/Divider'
import { LiquidityActionType } from 'src/shared/types/props'
import { isPoolForExtraReward } from 'src/shared/utils/pool-calc'
import { useCpk } from 'src/cpk'
import { useReadyState } from 'src/shared/web3'
import PoolBoxes, { PoolBoxesProps } from './PoolBoxes'
import PoolHead from './PoolHead'
import PoolCharts from './PoolCharts'
import PoolTabs from './PoolTabs'
import LiquidityModals from '../Liquidity/LiquidityModals'

interface PoolDetailsProps {
  pool?: PoolExpanded
  poolToken: NativeToken
  reload: () => void
  loading?: boolean
}

const PoolDetails = ({ pool, reload, loading = false }: PoolDetailsProps) => {
  // TODO: replace poolToken with received one from props
  const poolToken = { symbol: 'SPT', name: 'Swarm Pool Token' }
  const { t } = useTranslation('pools')
  const history = useHistory()
  const [liquidityModalOpen, setLiquidityModalOpen] = useFragmentState<
    LiquidityActionType | ''
  >('')

  const cpk = useCpk()
  const ready = useReadyState()

  const poolType = useMemo<PoolType>(() => {
    if (!loading && ready) {
      // eslint-disable-next-line no-nested-ternary
      return pool?.crpController === cpk?.address
        ? PoolType['my-pools']
        : pool?.finalized
        ? PoolType.shared
        : PoolType.private
    }
    return PoolType.shared
  }, [loading, ready, pool?.crpController, pool?.finalized, cpk?.address])

  const {
    totalShares = 0,
    swapFee = 0,
    id: poolAddress,
    totalSwapVolume = '0',
    swaps = [],
    cpkBalance,
  } = pool || {}

  const bigCpkBalance = cpkBalance || ZERO

  const bigTotalShares = useMemo(() => big(totalShares), [totalShares])

  const myPoolShare = useMemo(
    () =>
      (bigTotalShares.eq(0)
        ? ZERO
        : bigCpkBalance.div(bigTotalShares)
      ).toNumber(),
    [bigCpkBalance, bigTotalShares],
  )

  const bigVolume = useMemo(() => calculateVolume(totalSwapVolume, swaps), [
    swaps,
    totalSwapVolume,
  ])

  const calculatedLiquidity = useMemo(
    () => (pool ? calculateMarketCap(pool) : 0),
    [pool],
  )

  const poolBoxesProps: PoolBoxesProps = useMemo(
    () => ({
      swapFee: big(swapFee).times(100).toNumber(),
      liquidity: calculatedLiquidity,
      volume: bigVolume.toNumber(),
      myPoolShare,
    }),
    [bigVolume, calculatedLiquidity, myPoolShare, swapFee],
  )

  const goBack = useCallback(
    (e: SyntheticEvent) => {
      e.stopPropagation()
      history.push(`/pools/${PoolType[poolType]}`)
    },
    [history, poolType],
  )

  const handleAddLiquidityClick = useCallback(
    () => setLiquidityModalOpen('add'),
    [setLiquidityModalOpen],
  )

  const handleLiquidityModalClose = useCallback(
    () => setLiquidityModalOpen(''),
    [setLiquidityModalOpen],
  )

  const handleRemoveLiquidityClick = useCallback(
    () => setLiquidityModalOpen('remove'),
    [setLiquidityModalOpen],
  )

  if (!liquidityModalOpen && (!pool || loading || !ready))
    return <Loader size={50} m="auto" />

  const isExtraRewards = isPoolForExtraReward(pool)

  return (
    // TODO: move back button to the header component
    <>
      <Button.Text
        onClick={goBack}
        icon="ArrowBack"
        ml="35px"
        mt={[-32, -42]}
        mb={[22, 12, 26]}
        zIndex={1}
        fontSize="16px"
      >
        Back to {t(`tabs.${poolType}`)}
      </Button.Text>
      <Box
        width="100%"
        bg="background"
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={[3, 3, 4]}
        flexGrow={1}
      >
        <Card
          border="0"
          width="100%"
          p={4}
          borderRadius={1}
          overflow="hidden"
          display="flex"
          flexDirection="column"
          justifyContent="stretch"
        >
          <PoolHead
            symbol={poolToken.symbol}
            name={poolToken.name}
            extraRewards={isExtraRewards}
            onAddLiquidityClick={handleAddLiquidityClick}
            onRemoveLiquidityClick={handleRemoveLiquidityClick}
          />
          <Divider my="16px" />
          <PoolBoxes {...poolBoxesProps} />
          {poolAddress && <PoolCharts poolAddress={poolAddress} />}
          {pool && (
            <PoolTabs
              pool={pool}
              poolToken={poolToken}
              poolType={poolType}
              myPoolShare={myPoolShare}
              liquidity={calculatedLiquidity}
            />
          )}
        </Card>
      </Box>
      {pool && (
        <LiquidityModals
          pool={pool}
          openModal={liquidityModalOpen}
          reload={reload}
          loading={loading || !ready}
          onClose={handleLiquidityModalClose}
        />
      )}
    </>
  )
}

export default PoolDetails
