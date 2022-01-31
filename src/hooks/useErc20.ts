import { useCallback } from 'react'
import { ZERO } from 'src/shared/utils/big-helpers'
import useObservable from 'src/shared/hooks/useObservable'
import exchangeRateOf$ from 'src/shared/observables/exchangeRateOf'
import contractOf$ from 'src/shared/observables/contractOf'
import { useAccount } from 'src/shared/web3'
import { useCpk } from 'src/cpk'
import { useBalanceOf } from 'src/shared/observables/balanceOf'
import { useAllowanceOf } from 'src/shared/observables/allowanceOf'
import useAsyncMemo from './useAsyncMemo'

export const useErc20 = (address?: string) => {
  const contract = useObservable(() =>
    address ? contractOf$()({ address, id: address }) : undefined,
  )

  const [symbol, { loading: symbolLoading }] = useAsyncMemo(
    async () => (contract ? contract.getSymbol() : ''),
    '',
    [contract],
  )

  const [name, { loading: nameLoading }] = useAsyncMemo(
    async () => (contract ? contract.getName() : ''),
    '',
    [contract],
  )

  const [decimals, { loading: decimalsLoading }] = useAsyncMemo(
    async () => (contract ? contract.getDecimals() : 0),
    0,
    [contract],
  )

  const [
    totalSupply,
    { loading: totalSupplyLoading },
  ] = useAsyncMemo(
    async () => (contract ? contract.getTotalSupply() : ZERO),
    ZERO,
    [contract],
  )

  const exchangeRate = useObservable(() =>
    address ? exchangeRateOf$(0)({ id: address }) : undefined,
  )

  const balanceOf = useCallback(
    async (userAddress: string) =>
      contract ? contract.balanceOf(userAddress) : ZERO,
    [contract],
  )

  const account = useAccount()
  const cpk = useCpk()

  const balanceOfCurrentUser = useBalanceOf(account, address)

  const enable = useCallback(
    async () => cpk?.address && contract?.enableToken(cpk?.address),
    [cpk?.address, contract],
  )

  const disable = useCallback(
    async () => cpk?.address && contract?.disableToken(cpk?.address),
    [cpk?.address, contract],
  )

  const allowanceOfCurrentUser = useAllowanceOf(account, cpk?.address, address)

  return {
    address,
    contract,
    symbol,
    name,
    decimals,
    totalSupply,
    exchangeRate,
    balanceOf,
    balanceOfCurrentUser,
    enable,
    disable,
    allowanceOfCurrentUser,
    loading:
      nameLoading || symbolLoading || decimalsLoading || totalSupplyLoading,
  }
}
