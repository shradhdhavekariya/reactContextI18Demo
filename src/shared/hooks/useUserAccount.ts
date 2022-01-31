import { useMemo } from 'react'
import { useCpk } from 'src/cpk'
import { useCpkAddress } from 'src/state/hooks'
import { useAccount } from '../web3'

const useUserAccount = (selectedAddress?: string | null) => {
  const account = useAccount()
  const cpk = useCpk()
  const cpkAddress = useCpkAddress(selectedAddress)

  return useMemo(() => {
    if (selectedAddress && cpkAddress) {
      return {
        address: selectedAddress,
        cpkAddress,
      }
    }

    if (account && selectedAddress === account && cpk?.address) {
      return {
        address: account,
        cpkAddress: cpk?.address,
      }
    }

    return undefined
  }, [account, selectedAddress, cpk?.address, cpkAddress])
}

export default useUserAccount
