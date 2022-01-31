import { ReactElement, useEffect, useState, useMemo } from 'react'
import {
  differenceInMilliseconds,
  fromUnixTime,
  hoursToMilliseconds,
  minutesToMilliseconds,
  secondsToMilliseconds,
} from 'date-fns'
import match from 'conditional-expression'
import { formatDistanceToNowShort } from 'src/shared/utils/fromDistanceToNowShort'

const getTimeOut = (date: Date) => {
  const difference = differenceInMilliseconds(new Date(), date)

  return match(difference)
    .lessThan(minutesToMilliseconds(1))
    .then(
      secondsToMilliseconds(1) - (difference % secondsToMilliseconds(10)) + 1,
    )
    .lessThan(hoursToMilliseconds(1))
    .then(
      minutesToMilliseconds(1) - (difference % minutesToMilliseconds(1)) + 1,
    )
    .lessThan(24 * hoursToMilliseconds(1))
    .then(hoursToMilliseconds(1) - (difference % hoursToMilliseconds(1)) + 1)
    .else(null)
}

interface DateToNowProps {
  timestamp?: number
  fallback?: ReactElement | null | null
  render?: (val: string) => ReactElement | null | null
}

const DateToNow = ({
  timestamp,
  fallback = null,
  render = (val: string) => <>{val}</>,
}: DateToNowProps) => {
  const date = useMemo(() => (timestamp ? fromUnixTime(timestamp) : null), [
    timestamp,
  ])

  const [formatted, setFormatted] = useState(
    date
      ? formatDistanceToNowShort(date, {
          addSuffix: true,
        })
      : '',
  )

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (date && formatted) {
      const timeout = getTimeOut(date)

      if (timeout) {
        timer = setTimeout(
          () =>
            setFormatted(
              formatDistanceToNowShort(date, {
                addSuffix: true,
              }),
            ),
          timeout,
        )
      }
    }

    return () => clearTimeout(timer)
  }, [date, formatted])

  if (date && formatted) {
    return render(formatted)
  }

  if (fallback) {
    return fallback
  }

  return null
}

export default DateToNow
