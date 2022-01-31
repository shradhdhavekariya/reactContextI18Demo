import { TransactionResponse } from '@ethersproject/abstract-provider'
import { AssetToken, XToken } from '../tokens'
import ExtractProps from './extract-props'
import UserAccount from '../state/user-account'

interface AssetTokenRowFields {
  usdRate: number
  userBalances: {
    native: number
    usd: number
  }
}

interface AssetTokenRowActions {
  enable: () => Promise<TransactionResponse>
  disable: () => Promise<TransactionResponse>
}

interface TokenRowProps<K, T = Record<string, never>> {
  tokenToRender: K & T
  rowIndex: number
  hoveredIndex: number
  disableActions?: boolean
  selectedAccount?: UserAccount | null
  setHoveredIndex: (index: number) => void
  reload?: () => void
}

type AssetTokensAddOn = AssetTokenRowFields & AssetTokenRowActions
type AssetTokenRowProps = TokenRowProps<
  Omit<AssetToken, 'balance' | 'decimals'>,
  AssetTokensAddOn
>

type AssetTokenActionsProps = Pick<
  AssetToken,
  'address' | 'name' | 'symbol' | 'allowanceStatus'
> &
  AssetTokenRowActions

type PoolTokensRowProps = TokenRowProps<
  XToken,
  { userBalances: { ether: number; usd: number } }
>

export type {
  AssetTokenActionsProps,
  AssetTokenRowProps,
  ExtractProps,
  PoolTokensRowProps,
}
export * from './pool-chart.props'
export * from './liquidity-modal.props'
export * from './multiple-assets-row.props'
export * from './pool-overview.props'
export * from './advanced-settings.props'
