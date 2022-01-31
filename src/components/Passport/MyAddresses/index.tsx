import map from 'lodash/map'
import uniqBy from 'lodash/uniqBy'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Card, Heading, Icon, Loader } from 'rimble-ui'
import Divider from 'src/components/common/Divider'
import { Tier } from 'src/shared/enums'
import { toggleWalletAutoDisconnect } from 'src/shared/observables/walletAutoDisconnect'
import { AppState } from 'src/shared/types/state'
import { useAccount, useReadyState } from 'src/shared/web3'
import { connect } from 'src/state/AppContext'
import { useIsLoggedIn, useTier } from 'src/state/hooks'
import { tierAtLeast } from 'src/utils'
import styled from 'styled-components'
import { checkFeature } from 'src/components/common/Feature'
import AddressRow from './AddressRow'
import NewAddressModal from './NewAddressModal'

const StyledHead = styled(Box)`
  width: 100%;
`

const Status = styled.div`
  display: inline-block;
  width: 12px;
  margin-right: 4px;
`

interface AccountProps {
  label?: string
  address: string
  cpk_address?: string
}

interface MyAddressesStateProps {
  accounts: AccountProps[]
  isStoreReady: boolean
}

const MyAddresses = ({ accounts, isStoreReady }: MyAddressesStateProps) => {
  const { t } = useTranslation('passport')
  const account = useAccount()
  const ready = useReadyState()
  const isLoggedIn = useIsLoggedIn()
  const tier = useTier()
  const isAddAddressAvailable = useMemo(
    () =>
      isLoggedIn &&
      tierAtLeast(tier)(Tier.tier2) &&
      checkFeature('add-address'),
    [isLoggedIn, tier],
  )
  const [newAddressModalOpen, setNewAddressModalOpen] = useState(false)
  const [editAddress, setEditAddress] = useState<string>('')
  const allAccounts: AccountProps[] = uniqBy(
    [...map(accounts), { address: account || '' }],
    'address',
  )
  const handleAddAddressClick = () => {
    toggleWalletAutoDisconnect(false)
    setNewAddressModalOpen(true)
  }

  const handleCloseModal = () => {
    setNewAddressModalOpen(false)
    toggleWalletAutoDisconnect(true)
    if (editAddress) {
      setEditAddress('')
    }
  }

  if (!isStoreReady || !ready) return <Loader m="auto" size={30} />

  return (
    <>
      <Card
        p={['16px', '24px']}
        borderRadius={1}
        boxShadow={4}
        border="0"
        width="100%"
        flexDirection="column"
        mt={4}
      >
        {' '}
        <Heading
          as="h3"
          fontSize={3}
          lineHeight="28px"
          fontWeight={5}
          color="grey"
          m={0}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          id="my-addresses"
        >
          {t('myAddresses.header')}
          <Button.Text
            fontSize={2}
            onClick={handleAddAddressClick}
            disabled={!isAddAddressAvailable}
          >
            <Icon name="AddCircle" mr={1} size="16px" />{' '}
            {t('myAddresses.addAddress')}
          </Button.Text>
        </Heading>
        <Box textAlign="left" p={[0, 0, 0, 2]} mt={2}>
          {!!account && (
            <StyledHead
              color="grey"
              fontSize={1}
              fontWeight={5}
              pb={2}
              display={['none', 'none', 'none', 'flex']}
            >
              <Box flexBasis="25%">{t('myAddresses.th.address')}</Box>
              <Box flexBasis="30%" flexGrow="1">
                {isLoggedIn && t('myAddresses.th.label')}
              </Box>
              <Box flexBasis="20%">
                {isLoggedIn && t('myAddresses.th.linkedTo')}
              </Box>
              <Box flexBasis="150px" />
            </StyledHead>
          )}
          <Divider my="0" />
          <Box>
            {!account ? (
              <Box
                borderBottomColor="light-gray"
                borderBottomWidth={['1px']}
                borderBottomStyle="solid"
                py={3}
              >
                <Status>
                  <Icon name="Lens" size="12" color="danger" />
                </Status>
                {t('myAddresses.noAddressConnected')}
              </Box>
            ) : (
              allAccounts.map((accountInfo) => (
                <AddressRow
                  key={accountInfo.address}
                  address={accountInfo.address}
                  label={accountInfo?.label || ''}
                />
              ))
            )}
          </Box>
        </Box>
      </Card>
      <NewAddressModal
        isOpen={newAddressModalOpen || !!editAddress}
        onClose={handleCloseModal}
        address={editAddress}
      />
    </>
  )
}

const mapStateToProps = ({ user: { accounts }, initiated }: AppState) => ({
  accounts,
  isStoreReady: initiated,
})

export default connect(mapStateToProps)(MyAddresses)
