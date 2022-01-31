import { useMemo, useState } from 'react'
import { Heading, Button, Box, Input, Flex, Text } from 'rimble-ui'
import Divider from 'src/components/common/Divider'
import Dialog from 'src/components/common/Dialog'
import { useTranslation } from 'react-i18next'
import { tokenFilter } from 'src/shared/utils'
import { AbstractToken } from 'src/shared/types/tokens'
import { arrayWrap } from 'src/utils'
import TokenItem from './TokenItem'

export interface TokenSelectorModalProps<
  T extends AbstractToken = AbstractToken
> {
  loading?: boolean
  isOpen: boolean
  isFilter?: boolean
  onClose: () => void
  onSelection: (token: T) => void
  onButtonClick?: () => void
  buttonLabel?: string
  filter?: (token: T) => boolean
  badge?: (token: T) => React.ReactNode
  multiple?: boolean
  selected?: T | T[] | null
  tokens?: T[]
}

const TokenSelectorModal = <T extends AbstractToken = AbstractToken>({
  isOpen,
  isFilter = false,
  onClose,
  selected,
  onSelection,
  onButtonClick,
  buttonLabel = 'tokenModal.button',
  filter,
  badge,
  tokens = [],
  loading = false,
}: TokenSelectorModalProps<T>) => {
  const { t } = useTranslation('swap')
  const [search, setSearch] = useState('')
  const filteredTokens = useMemo(
    () => tokens.filter(tokenFilter(search, filter)),
    [tokens, filter, search],
  )

  const inputChangeHandler = (e: React.MouseEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value)
  }

  const handleTokenClick = (token: T) => () => onSelection({ ...token })

  return (
    <Dialog
      isOpen={isOpen}
      width={['100%', '460px']}
      maxHeight={['90%', '80%']}
      height={['90%', 'auto']}
      justifyContent="stretch"
      flex="1 0 100%"
    >
      <Box>
        <Button.Text
          icononly
          bg="transparent"
          mainColor="grey"
          icon="Close"
          position="absolute"
          top="34px"
          right="18px"
          height="28px"
          onClick={onClose}
          boxShadow={0}
        />
        <Heading as="h4" fontSize={4} fontWeight={5} mt={0}>
          {isFilter
            ? t('tokenModal.filterHeader')
            : t('tokenModal.selectHeader')}
        </Heading>
        <Input
          width="100%"
          bg="white"
          height="36px"
          placeholder="Search token name or paste contract address"
          onChange={inputChangeHandler}
          defaultValue={search}
        />
        <Divider mb={0} />
      </Box>
      <Flex
        flexDirection="column"
        overflowY="auto"
        minHeight="100px"
        py={3}
        flex="1 1 auto"
      >
        {loading || !tokens.length ? (
          <Text.span fontWeight={2} color="grey">
            {(loading && t('tokenModal.loading')) ||
              (!tokens.length && t('tokenModal.noResults'))}
          </Text.span>
        ) : (
          filteredTokens.map((token) => (
            <TokenItem
              key={token.id}
              symbol={token.symbol}
              name={token.name}
              badge={badge?.(token)}
              onClick={handleTokenClick(token)}
              background={
                arrayWrap(selected).some(
                  (selectedToken) => selectedToken.address === token.address,
                )
                  ? 'rgba(150,150,150,0.2)'
                  : 'none'
              }
            />
          ))
        )}
      </Flex>
      <Divider mt={0} />
      {!!onButtonClick && (
        <Box>
          <Button
            type="submit"
            width="100%"
            height={['40px', '52px']}
            fontWeight={4}
            fontSize={[2, 3]}
            onClick={onButtonClick}
            style={{ display: 'flex', justifyContent: 'flex-start' }}
          >
            {t(buttonLabel)}
          </Button>
        </Box>
      )}
    </Dialog>
  )
}

export default TokenSelectorModal
