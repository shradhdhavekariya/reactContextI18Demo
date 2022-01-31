/* eslint-disable import/no-duplicates */
import { formatDistanceToNowStrict } from 'date-fns'
import locale from 'date-fns/locale/en-US'
import formatDistance from './formatDistance'
import { FormatDistanceOptions } from './types'

export const formatDistanceToNowShort = (
  date: Date,
  options?: FormatDistanceOptions,
) =>
  formatDistanceToNowStrict(date, {
    ...options,
    locale: {
      ...locale,
      formatDistance,
    },
  })
