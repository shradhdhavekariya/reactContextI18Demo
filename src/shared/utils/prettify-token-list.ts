import { AbstractToken } from 'src/shared/types/tokens'
import { tokenFilter } from './token-filter'
import { tokenSorter } from './token-sorter'
import { compose } from './compose'
import {
  fillEtherFields,
  idToAddress,
  idToAddressXToken,
} from './convert-token-fields'

export const prettifyTokenList = <T extends AbstractToken>(list?: T[]): T[] =>
  (list || [])
    .map(compose(fillEtherFields, idToAddress, idToAddressXToken))
    .filter(tokenFilter())
    .sort(tokenSorter)
