export interface PoolChartProps {
  timestamps: number[]
  metrics: Record<number, number>
  yAxisTickFormatter: (value: number, index: number) => string
  tooltipFormatter: (value: number) => string
}
