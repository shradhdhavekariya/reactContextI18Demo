import { BigSource } from 'big.js'
import autoRound from './math/autoRound'

export const prettifyBalance = (balance: BigSource, base = 2): string => {
  const balanceStr = autoRound(balance, {
    minDecimals: base,
    maxDecimals: 6,
  }).toString()

  const [intPart, decimalPart] = balanceStr.split('.')
  const prettyIntPart = intPart.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')

  return decimalPart ? `${prettyIntPart}.${decimalPart}` : prettyIntPart
}
