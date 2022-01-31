import React, { useEffect, useRef, useState } from 'react'
import { Box, Flex } from 'rimble-ui'
import ScrollContainer from 'react-indiana-drag-scroll'
import { LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

export const commonAxisProps = {
  axisLine: false,
  tickLine: false,
  tickMargin: 10,
  stroke: '#9FA3BC',
  strokeWidth: 2,
}

interface ResponsivePoolChartProps {
  data: Record<'time' | 'value', number>[]
  yAxisTickFormatter: (value: number, index: number) => string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any
}

const ResponsivePoolChart = ({
  data,
  yAxisTickFormatter,
  children,
}: ResponsivePoolChartProps) => {
  const container = useRef<HTMLElement>(null)
  const [chartWidth, setChartWidth] = useState(data.length * 40)

  useEffect(() => {
    if (container.current) {
      container.current.scrollTo({ top: 0, left: chartWidth })
      if (container.current.clientWidth > chartWidth)
        setChartWidth(container.current.clientWidth)
    }
  }, [chartWidth])

  return (
    <Flex width="100%" height="100%" justifyContent="flex-end">
      <ScrollContainer innerRef={container} style={{ width: 'inherit' }}>
        <ResponsiveContainer width={chartWidth}>{children}</ResponsiveContainer>
      </ScrollContainer>

      <Box height="100%" width={70}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ right: 15 }}>
            <XAxis dataKey="time" width={0} />
            <YAxis
              {...commonAxisProps}
              dataKey="value"
              domain={['auto', 'auto']}
              orientation="right"
              tickFormatter={yAxisTickFormatter}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Flex>
  )
}

export default ResponsivePoolChart
