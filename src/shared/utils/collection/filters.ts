import { get } from 'lodash'
import equals from '../string/equals'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isEqual = (first: any, second: any) => {
  if (typeof first === 'string') {
    return typeof second === 'string' && equals(first, second)
  }

  return first === second
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const propEquals = <T extends object, U extends unknown = string>(
  path: string,
  value: U,
) => (item: T) => {
  const val = get(item, path)

  return isEqual(val, value)
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const propNotEqual = <T extends object, U extends unknown = string>(
  path: string,
  value: U,
) => (item: T) => {
  const val = get(item, path)

  return !isEqual(val, value)
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const propIn = <T extends object, U extends unknown = string>(
  path: string,
  value: U[],
) => (item: T) => {
  const val = get(item, path)

  return value.some((v) => isEqual(val, v))
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const propNotIn = <T extends object, U extends unknown = string>(
  path: string,
  value: U[],
) => (item: T) => {
  const val = get(item, path)

  return value.every((v) => !isEqual(val, v))
}
