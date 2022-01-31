import { useState } from 'react'
import { Button, Icon, Box, Text } from 'rimble-ui'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { FlexBasisProps, FlexboxProps, MarginProps } from 'styled-system'
import { AbstractToken } from 'src/shared/types/tokens'
import TokenSelectorModal from 'src/components/common/TokenSelector/TokenSelectorModal'
import TokenIcon from 'src/components/common/TokenIcon'
import Clickable from 'src/components/common/Clickable'

const StyledButton = styled(Button.Text)`
  outline: none;
  height: 32px;
`

const StyledClickable = styled(Clickable)`
  border-radius: 4px;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  border: 1px solid #e9eaf2;
  height: 32px;
`

const PillContainer = styled(Box)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 8px;
`

interface TokenPillProps extends MarginProps {
  token: AbstractToken
  onRemove: () => void
}

const TokenPill = ({ token, onRemove, ...props }: TokenPillProps) => {
  return (
    <StyledClickable alignItems="center" onClick={onRemove} {...props}>
      <TokenIcon
        symbol={token.symbol}
        name={token.name}
        width="16px"
        height="16px"
        mr={1}
      />
      <Text color="black" fontSize="14px" fontWeight={600} mr={1}>
        {token.symbol}
      </Text>
      <Icon name="Close" size="16px" color="black" />
    </StyledClickable>
  )
}

interface AssetFilterProps extends FlexBasisProps, FlexboxProps {
  tokens: AbstractToken[]
  loading?: boolean
  value: AbstractToken[]
  onSubmit: (value: AbstractToken[]) => void
}

const AssetFilter = ({
  tokens,
  loading,
  value,
  onSubmit,
  ...props
}: AssetFilterProps) => {
  const { t } = useTranslation('pools')
  const [tempSelection, setTempSelection] = useState(value)
  const [modalOpen, setModalOpen] = useState(false)

  const handleFilterButtonClick = () => {
    if (value.length) {
      onSubmit([])
    } else {
      setTempSelection(value)
      setModalOpen(true)
    }
  }
  const handleModalClose = () => setModalOpen(false)

  const handleTokenSelection = (token: AbstractToken) => {
    if (
      tempSelection.some(
        (selectedToken) => token.address === selectedToken.address,
      )
    ) {
      setTempSelection(
        tempSelection.filter(
          (selectedToken) => token.address !== selectedToken.address,
        ),
      )
    } else {
      setTempSelection([...tempSelection, token])
    }
  }

  const handleSubmit = () => {
    setModalOpen(false)
    onSubmit(tempSelection)
  }

  const handleAssetRemove = (asset: AbstractToken) => () => {
    onSubmit(value.filter((token) => token.address !== asset.address))
  }

  return (
    <Box {...props}>
      <PillContainer>
        {value.map((token) => (
          <TokenPill
            key={token.address}
            token={token}
            onRemove={handleAssetRemove(token)}
          />
        ))}
        <StyledButton
          size="medium"
          onClick={handleFilterButtonClick}
          flexShrink={0}
          ml={0}
          p={0}
        >
          {value.length ? (
            t('clearAll')
          ) : (
            <>
              <Icon name="FilterList" size="16px" mr={1} />
              {t('filterByAsset')}
            </>
          )}
        </StyledButton>
      </PillContainer>
      {modalOpen && (
        <TokenSelectorModal
          isOpen={modalOpen}
          isFilter
          onClose={handleModalClose}
          selected={tempSelection}
          onSelection={handleTokenSelection}
          onButtonClick={handleSubmit}
          buttonLabel={t('Filter')}
          multiple
          tokens={tokens}
          loading={loading}
        />
      )}
    </Box>
  )
}

export default AssetFilter
