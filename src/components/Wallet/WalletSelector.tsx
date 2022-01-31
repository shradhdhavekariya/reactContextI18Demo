import { useCallback, useContext, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router'
import { Flex, Box, Heading, Text } from 'rimble-ui'
import { map, uniq } from 'lodash'
import AddressSelect from 'src/components/common/AddressSelect'
import { connect } from 'src/state/AppContext'
import { AppState } from 'src/shared/types/state'
import { prettifyBalance } from 'src/shared/utils'
import { arrayWrap } from 'src/utils'
import { useTranslation } from 'react-i18next'
import UserAccount from 'src/shared/types/state/user-account'
import { useAccount } from 'src/shared/web3'
import equals from 'src/shared/utils/string/equals'
import { propEquals } from 'src/shared/utils/collection/filters'
import { WalletContext } from './WalletContext'

interface WalletSelectorStateProps extends Record<string, unknown> {
  accounts: UserAccount[]
}
interface AddressSelectOption {
  value: string
  label: string
  connected?: boolean
  disabled?: boolean
}

const WalletSelector = ({ accounts }: WalletSelectorStateProps) => {
  const account = useAccount()
  const { t } = useTranslation(['wallet'])
  const history = useHistory<{ preselectedAddress?: string }>()
  const {
    selectedAccount: selected,
    setSelectedAccount: onChange,
    userUsdBalance,
  } = useContext(WalletContext)

  const options = useMemo<AddressSelectOption[]>(() => {
    const uniqAddresses = uniq([
      ...arrayWrap(account),
      ...map(accounts || [], 'address'),
    ])

    return [
      ...uniqAddresses.map((address) => ({
        value: address.replace('x', '×'),
        label: accounts.find(propEquals('address', address))?.label || '',
        connected: !!account && equals(account, address),
      })),
      {
        value: '',
        label: t('walletSelector.addAddress'),
      },
    ]
  }, [account, accounts, t])

  const handleSelectChange = useCallback(
    (selection: AddressSelectOption | null) => {
      if (selection) {
        if (selection.value === '') {
          history.push('/passport#my-addresses')
        }
        onChange?.(selection.value?.replace('×', 'x'))
      } else {
        onChange?.(undefined)
      }
    },
    [history, onChange],
  )

  useEffect(() => {
    const { preselectedAddress } = history.location.state || {}

    if (preselectedAddress) {
      const preselectedOption =
        options.find(propEquals('value', preselectedAddress)) || null
      handleSelectChange(preselectedOption)
    } else {
      const activeOption = options.find(({ connected }) => !!connected) || null
      handleSelectChange(activeOption)
    }
  }, [options, handleSelectChange, history.location.state])

  return (
    <Flex
      width="100%"
      alignItems="flex-start"
      flexDirection={['column', 'row']}
      justifyContent="space-between"
      mb="24px"
    >
      <Box flexGrow="1" maxWidth={['100%', '532px']} width="100%">
        <Heading
          as="h4"
          fontSize={[1, 2]}
          lineHeight="copy"
          fontWeight={4}
          m={0}
          color="near-black"
        >
          {t('walletSelector.selectedAddress')}
        </Heading>
        <Box mt={2}>
          <AddressSelect
            options={options}
            onChange={handleSelectChange}
            value={
              selected
                ? {
                    value: selected.replace('x', '×'),
                    label:
                      options.find(propEquals('value', selected))?.label || '',
                  }
                : null
            }
          />
        </Box>
        <Text
          fontSize={1}
          color="near-black"
          mt={1}
          display={['block', 'none']}
        >
          {t('walletSelector.walletCounter')}
        </Text>
      </Box>
      <Box mt={[3, 0]}>
        <Heading
          as="h4"
          fontSize={[1, 2]}
          lineHeight="copy"
          fontWeight={4}
          m={0}
          color="near-black"
          textAlign={['left', 'right']}
        >
          {t('walletSelector.walletTotalValue')}
        </Heading>
        <Text fontWeight={4} color="near-black" fontSize={4} mt={[1, '12px']}>
          {prettifyBalance(userUsdBalance?.totalUsdBalance, 0)} USD
        </Text>
      </Box>
    </Flex>
  )
}

const mapStateToProps = ({ user: { accounts, id } }: AppState) => ({
  accounts,
  userId: id,
})

export default connect<Record<string, never>, WalletSelectorStateProps>(
  mapStateToProps,
)(WalletSelector)
