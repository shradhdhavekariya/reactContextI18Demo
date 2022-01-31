import React, { useMemo, useState } from 'react'
import { Bar, BarChart, Cell, Tooltip, XAxis, YAxis } from 'recharts'
import { formatXAxisTick, generateChartData } from 'src/shared/utils'
import { PoolChartProps } from 'src/shared/types/props'
import ResponsivePoolChart, { commonAxisProps } from './ResponsiveChart'

const BarPoolChart = ({
  metrics,
  timestamps,
  yAxisTickFormatter,
  tooltipFormatter,
}: PoolChartProps) => {
  const [activeBar, setActiveBar] = useState<null | number>(null)
  const data = useMemo(() => generateChartData(timestamps, metrics), [
    metrics,
    timestamps,
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onBarEnter = (_: any, index: number) => setActiveBar(index)

  return (
    <ResponsivePoolChart data={data} yAxisTickFormatter={yAxisTickFormatter}>
      <BarChart data={data} margin={{ right: 10 }} barCategoryGap={2}>
        <YAxis domain={['auto', 'auto']} width={0} orientation="right" />
        <XAxis
          {...commonAxisProps}
          dataKey="time"
          interval={1}
          tickFormatter={formatXAxisTick}
        />
        <Tooltip
          isAnimationActive={false}
          allowEscapeViewBox={{ x: false, y: false }}
          labelFormatter={() => ''}
          itemStyle={{ color: '#fff' }}
          cursor={false}
          contentStyle={{
            backgroundColor: '#262626',
            borderRadius: '4px',
            padding: '8px',
            visibility: activeBar !== null ? 'visible' : 'hidden',
          }}
          separator=""
          formatter={(value: number) => [tooltipFormatter(value), '']}
        />
        <Bar
          dataKey="value"
          fill="#0179EF"
          onMouseEnter={onBarEnter}
          onMouseLeave={() => setActiveBar(null)}
        >
          {data.map(({ time }, index) => (
            <Cell
              key={time}
              style={{ transition: '.5s' }}
              fill={
                activeBar === null || index === activeBar
                  ? '#0179EF'
                  : '#0179EF30'
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsivePoolChart>
  )
}

export default BarPoolChart
