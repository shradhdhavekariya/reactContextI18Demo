import { Text } from 'rimble-ui'
import match from 'conditional-expression'
import { AbstractToken } from 'src/shared/types/tokens'
import { useAccount } from 'src/shared/web3'
import TokenSelectorModal, {
  TokenSelectorModalProps,
} from './TokenSelectorModal'
import Balance from '../Balance'

const BalanceTokenSelectorModal = <T extends AbstractToken = AbstractToken>(
  props: TokenSelectorModalProps<T>,
) => {
  const account = useAccount()
  const getTokenBadge = (token: AbstractToken) =>
    match(token?.balance)
      .on((value: unknown) => typeof value === 'undefined')
      .then('')
      .else(
        <Text.span
          fontWeight={2}
          color="grey"
          flexGrow={1}
          flexBasis="auto"
          textAlign="right"
        >
          <Balance tokenAddress={token.id} account={account} />
        </Text.span>,
      )

  return <TokenSelectorModal {...props} badge={getTokenBadge} />
}

export default BalanceTokenSelectorModal
