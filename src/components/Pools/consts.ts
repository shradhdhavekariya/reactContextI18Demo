import { invokeMap, isEqual } from 'lodash'
import { ArrayParam, withDefault } from 'use-query-params'

export const PageLimit = 20

export const AssetParam = withDefault(
  {
    ...ArrayParam,
    decode: (...args) => invokeMap(ArrayParam.decode(...args), 'toLowerCase'),
    equals: (
      valueA: (string | null)[] | string[] | null | undefined,
      valueB: (string | null)[] | string[] | null | undefined,
    ) => {
      if (valueA === valueB) return true
      if (valueA == null || valueB == null) return valueA === valueB

      return isEqual(valueA.sort(), valueB.sort())
    },
  },
  [] as string[],
)
