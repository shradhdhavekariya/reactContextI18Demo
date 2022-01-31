import { Contract, ContractInterface, providers, Signer } from 'ethers'
import { isAddress } from 'ethers/lib/utils'
import { getSigner, readOnlyProvider, walletProvider$ } from 'src/shared/web3'
import verify from 'src/shared/utils/verify'

export type ContractInstances<
  T extends AbstractContract = AbstractContract
> = Record<string, T>

abstract class AbstractContract {
  static instances: ContractInstances = {}

  address: string

  abi: ContractInterface

  signer?: Signer

  contract: Contract | undefined

  initiated = false

  protected web3Provider: providers.Web3Provider | undefined

  protected constructor(
    address: string,
    abi: ContractInterface,
    signer: Signer | undefined = getSigner(),
  ) {
    verify(
      isAddress(address),
      'Address of contract not provided for constructor',
    )
    verify(!!abi, 'ABI of contract not provided for constructor')

    this.address = address
    this.abi = abi
    this.signer = signer
  }

  protected init = async () => {
    if (this.initiated) return

    if (!this.contract && this.address) {
      this.contract = new Contract(this.address, this.abi, readOnlyProvider)

      this.initiated = true
    }
  }

  protected updateSigner = async () => {
    const walletProvider = walletProvider$.getValue()
    if (walletProvider) {
      const signer = getSigner(walletProvider)

      if (signer) {
        try {
          this.contract = new Contract(this.address, this.abi, signer)
          this.contract.connect(signer)
        } catch {
          this.contract = new Contract(this.address, this.abi, readOnlyProvider)
        }
      }
    }
  }
}

export default AbstractContract
