import { useState } from 'react'
import { Link, Button, Icon, Box, Flex, Text } from 'rimble-ui'
import { Launch, ContentCopy } from '@rimble/icons'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { errorOccurred } from 'src/state/actions/app'
import { useSnackbar } from 'src/components/common/Snackbar'
import { AlertVariant } from 'src/components/common/Snackbar/types'
import api from 'src/services/api'
import { connect } from 'src/state/AppContext'
import { profileUpdated } from 'src/state/actions/users'
import { AppState, DispatchWithThunk } from 'src/shared/types/state'
import { ProfileResponse } from 'src/shared/types/api-responses'
import { generateEtherscanUrl, truncateStringInTheMiddle } from 'src/utils'
import blotout from 'src/services/blotout'
import InlineInput from 'src/components/common/InlineInput'
import { useAccount, useNetworkId } from 'src/shared/web3'
import { Color } from 'src/theme'
import { RouterLink } from 'src/components/common/RouterLink'
import { useIsLoggedIn } from 'src/state/hooks'
import equals from 'src/shared/utils/string/equals'
import ConfirmUnlinkModal from './ConfirmUnlinkModal'

const Underlined = styled(Text.span)`
  text-decoration: underline;
`

const Row = styled(Flex)`
  flex-wrap: wrap;
`

const Cell = styled(Flex)`
  align-items: center;
  flex-wrap: wrap;
  flex-shrink: 1;
  overflow: ${(props) => props.overflow || 'hidden'};
  text-overflow: ellipsis;
`

const Address = styled(Flex)`
  overflow: hidden;
  word-break: break-all;
  align-items: center;
`

interface AddressRowProps {
  address: string
  label: string
}

interface AddressRowStateProps extends Record<string, unknown> {
  name: string
}

interface AddressRowActions extends Record<string, unknown> {
  updateProfile: (profile: ProfileResponse) => void
  reportError: (e: string) => void
}

const AddressRow = ({
  address,
  name,
  updateProfile,
  reportError,
  label,
}: AddressRowProps & AddressRowStateProps & AddressRowActions) => {
  const { t } = useTranslation('passport')
  const { addAlert, addError } = useSnackbar()
  const networkId = useNetworkId()
  const isLoggedIn = useIsLoggedIn()
  const account = useAccount()
  const [isEditing, setEditing] = useState<boolean>(false)
  const [confirmUnlinkModalIsOpen, setConfirmUnlinkModalIsOpen] = useState(
    false,
  )

  const handleCopyClick = async () => {
    await navigator.clipboard.writeText(address.replace('×', 'x'))
    addAlert(
      t('general.copiedToClipboard', {
        address: truncateStringInTheMiddle(address),
      }),
      {
        variant: AlertVariant.success,
        autoDismissible: true,
      },
    )
  }

  const handleUnlinkClick = async () => {
    setConfirmUnlinkModalIsOpen(true)
  }

  const handleModalOnCancel = () => {
    setConfirmUnlinkModalIsOpen(false)
  }

  const handleModalOnConfirm = async () => {
    setConfirmUnlinkModalIsOpen(false)
    try {
      await api.deleteAddress(address)
      blotout.captureAdditionalAddressRemove(address)
    } catch (e) {
      addError(e, {
        description: t('myAddresses.unlinkAddressError', {
          address: truncateStringInTheMiddle(address),
        }),
      })

      reportError(e.message)
      return
    }

    const profile = await api.profile()

    updateProfile(profile)

    addAlert(
      t('myAddresses.unlinkAddress', {
        address: truncateStringInTheMiddle(address),
      }),
      {
        variant: AlertVariant.success,
        autoDismissible: true,
      },
    )
  }

  const handleLabelUpdate = async (addressName: string) => {
    setEditing(false)
    try {
      await api.updateAddressLabel(address, addressName)
    } catch (e) {
      addError(e, {
        description: t('myAddresses.addNameError', {
          variant: AlertVariant.error,
          autoDismissible: true,
        }),
      })
    }
    const profile = await api.profile()
    updateProfile(profile)
  }

  return (
    <>
      <Row
        borderBottomColor="light-gray"
        borderBottomWidth={['1px']}
        borderBottomStyle="solid"
        py={2}
      >
        <Cell
          flexBasis={['100%', '100%', '100%', '25%']}
          maxWidth={['100%', '100%', '100%', '25%']}
          pr={2}
        >
          <Box
            display={['block', 'block', 'block', 'none']}
            fontWeight={4}
            color="grey"
            fontSize={1}
            mb={1}
            flexBasis="100%"
          >
            {t('myAddresses.th.address')}
          </Box>
          <Address>
            <RouterLink
              pathname="/wallet"
              state={{ preselectedAddress: address }}
            >
              <Underlined>{truncateStringInTheMiddle(address)}</Underlined>
            </RouterLink>
            <Button.Text
              iconOnly
              size="small"
              p={0}
              m={0}
              onClick={handleCopyClick}
              mainColor={Color.grey}
              title={t('myAddresses.copy')}
            >
              <ContentCopy size={18} />
            </Button.Text>
            <Link
              href={generateEtherscanUrl({
                type: 'address',
                hash: address,
                chainId: networkId,
              })}
              target="_blank"
              color={Color.grey}
              mt={1}
            >
              <Launch size={18} />
            </Link>
          </Address>
        </Cell>
        <Cell flexBasis={['100%', '100%', '100%', '30%']} flexGrow="1">
          {isLoggedIn && (
            <>
              <Box
                display={['block', 'block', 'block', 'none']}
                fontWeight={4}
                color="grey"
                fontSize={1}
                mt={3}
                mb={1}
                flexBasis="100%"
              >
                {t('myAddresses.th.label')}
              </Box>
              <Flex
                justifyContent="space-between"
                alignItems="center"
                position={isEditing && 'absolute'}
                maxWidth="200px"
                flex={1}
              >
                {!isEditing && (
                  <Text.span fontWeight={2} fontSize={2} color="near-black">
                    {label}
                  </Text.span>
                )}
                <InlineInput
                  onConfirm={handleLabelUpdate}
                  onCancel={() => setEditing(false)}
                  onClick={() => setEditing(true)}
                  initialValue={label}
                />
              </Flex>
            </>
          )}
        </Cell>
        <Cell flexBasis={['100%', '100%', '100%', '20%']}>
          <Box
            display={['block', 'block', 'block', 'none']}
            fontWeight={4}
            color="grey"
            fontSize={1}
            mt={3}
            mb={1}
            flexBasis="100%"
          >
            {t('myAddresses.th.linkedTo')}
          </Box>
          <Text.span fontWeight={2} fontSize={2} color="near-black">
            {name}
          </Text.span>
        </Cell>
        <Cell
          flexBasis={['auto', '150px']}
          flexGrow={[1, 0]}
          justifyContent={[
            'flex-start',
            'flex-start',
            'flex-start',
            'flex-end',
          ]}
        >
          {!equals(account, address) && (
            <Button.Text
              mainColor="danger"
              fontSize={2}
              height="40px"
              onClick={handleUnlinkClick}
            >
              <Icon
                name="RemoveCircleOutline"
                color="danger"
                mr="6px"
                size="16px"
              />{' '}
              {t('myAddresses.unlink')}
            </Button.Text>
          )}
        </Cell>
      </Row>

      <ConfirmUnlinkModal
        isOpen={confirmUnlinkModalIsOpen}
        address={address}
        onCancel={handleModalOnCancel}
        onConfirm={handleModalOnConfirm}
      />
    </>
  )
}

const mapStateToProps = ({ user: { givenName, familyName } }: AppState) => ({
  name: `${givenName || ''} ${familyName || ''}`,
})

const mapDispatchToProps = (dispatch: DispatchWithThunk<AppState>) => ({
  updateProfile: (profile: ProfileResponse) =>
    dispatch(profileUpdated(profile)),
  reportError: (e: string) => dispatch(errorOccurred(e)),
})

export default connect<
  AddressRowProps,
  AddressRowStateProps,
  AddressRowActions
>(
  mapStateToProps,
  mapDispatchToProps,
)(AddressRow)
