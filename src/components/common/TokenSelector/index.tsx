import { ReactNode, useState } from 'react'
import styled from 'styled-components'
import { Button, Loader } from 'rimble-ui'
import { useTranslation } from 'react-i18next'
import TokenIcon from 'src/components/common/TokenIcon'
import Label from 'src/components/common/Form/Label'
import { useAccount } from 'src/shared/web3'
import { AbstractToken } from 'src/shared/types/tokens'
import BalanceTokenSelectorModal from './BalanceTokenSelectorModal'
import Balance from '../Balance'

const TokenButton = styled(Button.Outline)`
  width: 100%;
  height: 36px;
  color: ${({ theme }) => theme.colors.black};

  .button-text {
    align-items: center;
  }

  @media (min-width: ${({ theme }) => theme?.breakpoints[0]}) {
    height: 48px;
  }
`

interface TokenSelectorProps<T extends AbstractToken = AbstractToken> {
  tokens: T[]
  onChange: (token: T) => void
  selected?: T
  filter?: (token: T) => boolean
  loading?: boolean
  emptyValue?: ReactNode
}

const TokenSelector = <T extends AbstractToken = AbstractToken>({
  tokens,
  onChange,
  selected,
  filter,
  loading = false,
  emptyValue,
}: TokenSelectorProps<T>) => {
  const [modalOpen, setModalOpen] = useState(false)
  const { t } = useTranslation('swap')
  const account = useAccount()

  const handleModalClose = () => {
    setModalOpen(false)
  }

  const handleClick = () => {
    setModalOpen(true)
  }

  const handleTokenSelection = (token: T) => {
    setModalOpen(false)
    onChange(token)
  }

  return (
    <>
      <Label right>
        {t('assets.balance')}
        <Balance tokenAddress={selected?.id} account={account} base={4} />
      </Label>
      <TokenButton onClick={handleClick}>
        {loading && <Loader m="auto" />}
        {!loading && selected && (
          <>
            <TokenIcon
              mr={3}
              symbol={selected?.symbol}
              name={selected?.name}
              width="24px"
              height="24px"
            />
            {selected?.symbol.toLocaleUpperCase() || '--'}
          </>
        )}
        {!loading && !selected && emptyValue}
      </TokenButton>
      {modalOpen && (
        <BalanceTokenSelectorModal
          isOpen={modalOpen}
          onClose={handleModalClose}
          selected={selected}
          onSelection={handleTokenSelection}
          filter={filter}
          tokens={tokens}
          loading={loading}
        />
      )}
    </>
  )
}

export default TokenSelector
