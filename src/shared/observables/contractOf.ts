import { from } from 'rxjs'
import { Erc20 } from 'src/contracts/ERC20'
import { VSMT } from 'src/contracts/VSMT'
import { AbstractToken } from 'src/shared/types/tokens'
import { isVSMT } from 'src/shared/utils/tokens/filters'

const contractOf$ = () => <
  T extends Pick<AbstractToken, 'id' | 'address'> = AbstractToken
>(
  token: T,
) => from((isVSMT(token) ? VSMT : Erc20).getInstance(token.id))

export default contractOf$
