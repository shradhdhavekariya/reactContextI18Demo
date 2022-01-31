import { TimeUnit } from './types'

const formatDistanceLocale: Record<string, string | TimeUnit> = {
  lessThanXSeconds: {
    one: '<1s',
    other: '<{{count}}s',
  },

  xSeconds: {
    one: '1s',
    other: '{{count}}s',
  },

  halfAMinute: '<1m',

  lessThanXMinutes: {
    one: '<1m',
    other: '<{{count}}m',
  },

  xMinutes: {
    one: '1m',
    other: '{{count}}m',
  },

  aboutXHours: {
    one: '<1h',
    other: '<{{count}}h',
  },

  xHours: {
    one: '1h',
    other: '{{count}}h',
  },

  xDays: {
    one: '1d',
    other: '{{count}}d',
  },

  aboutXWeeks: {
    one: '<1w',
    other: '<{{count}}w',
  },

  xWeeks: {
    one: '1w',
    other: '{{count}}w',
  },

  aboutXMonths: {
    one: '<1m',
    other: '<{{count}}m',
  },

  xMonths: {
    one: '1m',
    other: '{{count}}m',
  },

  aboutXYears: {
    one: '<1y',
    other: '<{{count}}y',
  },

  xYears: {
    one: '1y',
    other: '{{count}}y',
  },

  overXYears: {
    one: '>1y',
    other: '>{{count}}y',
  },

  almostXYears: {
    one: '<1y',
    other: '<{{count}}y',
  },
}

export default formatDistanceLocale
