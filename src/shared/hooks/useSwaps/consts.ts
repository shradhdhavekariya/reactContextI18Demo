import { startOfDay, subDays } from 'date-fns'
import { SwapsQueryResult } from './types'

export const INITIAL_SWAP_QUERY_RESULT: SwapsQueryResult = {
  called: false,
  loading: false,
  refetching: false,
  hasMore: false,
  refetch: () => {},
  fetchMore: () => {},
  data: undefined,
  error: undefined,
}

export const DEFAULT_DATE_FROM = startOfDay(subDays(new Date(), 14))

export const DEFAULT_OPTIONS = { dateFrom: DEFAULT_DATE_FROM, skip: 0 }
