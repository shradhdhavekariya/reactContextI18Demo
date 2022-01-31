import { fromUnixTime } from 'date-fns'
import { Month } from '../enums'

export const generateChartData = (
  timestamps: number[],
  metrics: Record<string, number>,
) => timestamps.map((time) => ({ time, value: metrics[time] }))

export const formatXAxisTick = (value: number) => {
  const dateObj = fromUnixTime(value)

  return (dateObj.getDate() === 1
    ? Month[dateObj.getMonth()]
    : dateObj.getDate()
  ).toString()
}
