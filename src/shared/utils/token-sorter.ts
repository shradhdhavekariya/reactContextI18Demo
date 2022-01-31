import { AbstractToken } from 'src/shared/types/tokens'

export const tokenSorter = <T extends AbstractToken>(a: T, b: T) =>
  a.symbol.toLowerCase() > b.symbol.toLowerCase() ? 1 : -1
