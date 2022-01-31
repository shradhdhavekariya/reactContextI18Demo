import { AbstractToken } from 'src/shared/types/tokens'
import { propEquals } from './collection/filters'

type Filter<K> = (token: K) => boolean

export const tokenFilter = <T extends AbstractToken>(
  needle = '',
  filter?: Filter<T>,
) => (token: T, index: number, self: T[]): boolean => {
  const lowercaseNeedle = needle.toLowerCase()

  return (
    self.findIndex(propEquals('id', token.id)) === index &&
    (token.name.toLowerCase().includes(lowercaseNeedle) ||
      token.symbol.toLowerCase().includes(lowercaseNeedle)) &&
    (filter ? filter(token) : true)
  )
}
