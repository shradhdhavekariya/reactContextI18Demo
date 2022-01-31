import { Text } from 'rimble-ui'
import styled from 'styled-components'
import Clickable, { ClickableProps } from '../Clickable'
import TokenIcon from '../TokenIcon'

interface TokenItemProps extends Omit<ClickableProps, 'children'> {
  symbol: string
  name: string
  badge?: React.ReactNode
  onClick: () => void
}

const TokenLabel = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const TokenItem = ({
  symbol,
  name,
  badge,
  onClick,
  ...props
}: TokenItemProps) => {
  return (
    <Clickable
      justifyContent="space-between"
      alignItems="stretch"
      py="12px"
      px={2}
      borderRadius={2}
      onClick={onClick}
      {...props}
    >
      <TokenIcon symbol={symbol} name={name} width="32px" height="32px" />
      <TokenLabel
        color="black"
        fontWeight={5}
        flexGrow={1}
        ml={3}
        flexBasis="50%"
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
        {symbol}
        <Text.span fontWeight={2} title={name}>{` (${name})`}</Text.span>
      </TokenLabel>
      {badge}
    </Clickable>
  )
}

export default TokenItem
