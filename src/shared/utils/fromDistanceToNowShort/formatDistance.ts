import formatDistanceLocale from './formatDistanceLocale'
import { FormatDistanceOptions, TimeUnit } from './types'

export default function formatDistance(
  token: keyof typeof formatDistanceLocale,
  count: number,
  options?: FormatDistanceOptions,
) {
  const realOptions: FormatDistanceOptions = options || {}

  let result
  if (typeof formatDistanceLocale[token] === 'string') {
    result = formatDistanceLocale[token]
  } else if (count === 1) {
    result = (formatDistanceLocale[token] as TimeUnit).one
  } else {
    result = (formatDistanceLocale[token] as TimeUnit).other.replace(
      '{{count}}',
      count.toString(),
    )
  }

  if (realOptions?.addSuffix) {
    if ((realOptions?.comparison || 0) > 0) {
      return `in ${result}`
    }
    return `${result} ago`
  }

  return result
}
