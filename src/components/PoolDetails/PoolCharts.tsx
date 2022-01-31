import React, { ChangeEvent, useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Tabs } from '@material-ui/core'
import { Box, Loader } from 'rimble-ui'
import match from 'conditional-expression'
import { usePoolMetrics } from 'src/shared/hooks'
import StyledTab from 'src/components/common/StyledTab'
import { formatBigInt } from 'src/shared/utils/formatting'
import { prettifyBalance, recursiveRound } from 'src/shared/utils'
import LinePoolChart from 'src/components/common/Charts/LinePoolChart'
import BarPoolChart from 'src/components/common/Charts/BarPoolChart'

interface PoolChartsProps {
  poolAddress: string
}

const PoolCharts = ({ poolAddress }: PoolChartsProps) => {
  const { t } = useTranslation('poolDetails')
  const [currentChartIndex, setCurrentChartIndex] = useState(0)
  const {
    timestamps,
    liquidityMetrics,
    swapFeeMetrics,
    volumeMetrics,
    loading,
    error,
  } = usePoolMetrics(poolAddress)

  const handleSwitchTab = useCallback(
    // eslint-disable-next-line @typescript-eslint/ban-types
    (e: ChangeEvent<{}>, index: number) => {
      if (index !== currentChartIndex) {
        setCurrentChartIndex(index)
      }
    },
    [currentChartIndex],
  )

  const dollarChartProps = useMemo(
    () => ({
      timestamps,
      yAxisTickFormatter: (value: number) => `$${formatBigInt(value)}`,
      tooltipFormatter: (value: number) => `$ ${prettifyBalance(value)}`,
    }),
    [timestamps],
  )

  const swapFeeChartProps = useMemo(
    () => ({
      timestamps,
      metrics: swapFeeMetrics,
      yAxisTickFormatter: (value: number) => `${value}%`,
      tooltipFormatter: (value: number) => `${recursiveRound(value)}%`,
    }),
    [swapFeeMetrics, timestamps],
  )

  return (
    <>
      <Tabs
        value={currentChartIndex}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleSwitchTab}
        aria-label="chart tabs"
      >
        <StyledTab label={t('charts.liquidity')} />
        <StyledTab label={t('charts.volume')} />
        <StyledTab label={t('charts.feeReturns')} />
      </Tabs>
      <Box role="tabpanel" height="285px">
        {(loading && <Loader m="auto" />) ||
          (error && 'An error occurred!') ||
          match(currentChartIndex)
            .equals(0)
            .then(
              <LinePoolChart
                metrics={liquidityMetrics}
                {...dollarChartProps}
              />,
            )
            .equals(1)
            .then(
              <BarPoolChart metrics={volumeMetrics} {...dollarChartProps} />,
            )
            .equals(2)
            .then(<LinePoolChart {...swapFeeChartProps} />)
            .else(null)}
      </Box>
    </>
  )
}

export default PoolCharts
