import { ChangeEvent, HTMLAttributes, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Button, Box, Text, Flex } from 'rimble-ui'
import { MarginProps } from 'styled-system'
import { profileUpdated } from 'src/state/actions/users'
import { useSnackbar } from 'src/components/common/Snackbar'
import { AlertVariant } from 'src/components/common/Snackbar/types'
import { connect } from 'src/state/AppContext'
import api from 'src/services/api'
import { AppState, DispatchWithThunk } from 'src/shared/types/state'
import { ProfileResponse } from 'src/shared/types/api-responses'
import { truncateStringInTheMiddle } from 'src/utils'
import Dialog from 'src/components/common/Dialog'
import UserAccount from 'src/shared/types/state/user-account'
import { propEquals } from 'src/shared/utils/collection/filters'
import blotout from 'src/services/blotout'
import { useAccount, getSigner } from 'src/shared/web3'
import { ExtractProps } from 'src/shared/types/props'
import Blockie from 'src/components/common/Blockie'

interface NewAddressModalProps {
  isOpen: boolean
  onClose: () => void
  address?: string
}

interface NewAddressModalStateProps extends Record<string, unknown> {
  accounts: UserAccount[]
}

interface NewAddressModalActions extends Record<string, unknown> {
  updateProfile: (profile: ProfileResponse) => void
}

interface InputProps extends ExtractProps<typeof Flex>, MarginProps {
  value?: string
  onChange?: (value: string) => void
  inputProps?: HTMLAttributes<HTMLInputElement>
  disabled?: boolean
  placeholder?: string
  address: string
}

export const AddressItem = styled.div`
  display: flex;
  align-items: center;
  background-color: #f0f8ff;
  padding: 15px 15px;
  cursor: pointer;
  border-radius: 5px;
  user-select: none;

  img {
    width: 25px;
    height: 25px;
    margin-right: 10px;
  }
`

const StyledWrapper = styled(Flex)`
  border: 1px solid ${({ theme }) => theme.colors.grey};
  border-radius: ${({ theme }) => theme.borderWidths[3]};
  height: 50px;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes[2]}px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
  max-width: 100%;
  padding: 0 13px;

  img {
    width: 25px;
    height: 25px;
    margin-right: 10px;
  }

  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  }

  &:focus-within {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  & > input {
    height: ${({ height }) => height || '36px'};
    border: none;
    background: none;
    border-radius: ${({ theme }) => theme.borderWidths[3]};
    font-size: 18px;
    flex-grow: 1;
    min-width: 0;
    -moz-appearance: textfield;
    outline: none;
    width: 100%;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  @media (max-width: ${({ theme }) => theme?.breakpoints[0]}) {
    height: 36px;
  }
`

const AddressNameInput = ({
  onChange,
  value = '',
  disabled = false,
  placeholder,
  address,
  ...props
}: InputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: newValue } = e.target
    if (onChange) {
      onChange(newValue)
    }
  }

  return (
    <StyledWrapper {...props}>
      <Blockie address={address} />
      <input
        type="text"
        onChange={handleChange}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
      />
    </StyledWrapper>
  )
}

const NewAddressModal = ({
  accounts,
  isOpen,
  onClose,
  updateProfile,
  address,
}: NewAddressModalProps &
  NewAddressModalStateProps &
  NewAddressModalActions) => {
  const { t } = useTranslation('passport')
  const account = useAccount()
  const registered =
    accounts.length && accounts.find(propEquals('address', account))
  const { addAlert, addError } = useSnackbar()
  const [loading, setLoading] = useState(false)
  const [addressName, setAddressName] = useState('')

  const handleAddClick = async () => {
    if (!account) {
      return
    }
    if (registered) {
      addAlert(t('myAddresses.addressLinked'), {
        variant: AlertVariant.error,
        autoDismissible: true,
      })
      return
    }

    const signer = getSigner()

    if (!signer) {
      return
    }

    setLoading(true)

    const exists = await api.checkExistence(account)

    if (exists) {
      addAlert(t('myAddresses.addressRegistered'), {
        variant: AlertVariant.warning,
        autoDismissible: true,
      })
      setLoading(false)
      return
    }

    const {
      attributes: { message },
    } = await api.nonceMessage(account)

    try {
      const signedMessage = await signer.signMessage(message)
      if (signedMessage) {
        await api.addAddress(account, signedMessage)
        await api.updateAddressLabel(account, addressName)
        blotout.captureAdditionalAddressAdd(account)
      }
    } catch (e) {
      addError(e, { description: t('myAddresses.addError') })
      setLoading(false)
      onClose()
      return
    }
    addAlert(
      t('myAddresses.addSuccess', {
        address: truncateStringInTheMiddle(account),
      }),
      {
        variant: AlertVariant.success,
        autoDismissible: true,
      },
    )
    const profile = await api.profile()
    updateProfile(profile)
    setLoading(false)
    onClose()
  }

  return (
    <Dialog
      isOpen={isOpen}
      width={['100%', '540px']}
      height="auto"
      maxHeight="80%"
      onClose={onClose}
      title={t(
        address ? 'myAddresses.modal.editAddress' : 'myAddresses.modal.header',
      )}
      titleProps={{ mb: '2' }}
    >
      {!address && registered ? (
        <Box>
          <Text.p fontSize="17px" color="grey" mb={3}>
            {t('myAddresses.modal.instruction')}
          </Text.p>
          <Box my={4}>
            <Text.p color="grey" fontWeight={5}>
              {t('myAddresses.modal.selectNewAddress')}:
            </Text.p>
            <AddressItem>
              <Blockie address={account} />
              <Text.p fontSize="18px" my={0}>
                {t('myAddresses.modal.connectNewAddress')}
              </Text.p>
            </AddressItem>
          </Box>
          <Text.p fontSize="17px" color="grey">
            {t('myAddresses.modal.instruction1')}
          </Text.p>
        </Box>
      ) : (
        <Box>
          <Text.p fontSize="17px" color="grey">
            {t('myAddresses.modal.instruction')}
          </Text.p>
          <Box mt={4} mb={4}>
            <Text.p color="grey" fontWeight={5}>
              {t('myAddresses.modal.yourNewAddress')}:
            </Text.p>
            <AddressItem>
              <Blockie address={account} />
              <Text.p fontSize="18px" my={0}>
                {truncateStringInTheMiddle(account ?? address ?? '')}
              </Text.p>
            </AddressItem>
          </Box>
          <Box mb={4}>
            <Text.p color="grey" fontWeight={5}>
              {t('myAddresses.modal.giveAddressName')}
            </Text.p>
            <AddressNameInput
              value={addressName}
              onChange={setAddressName}
              placeholder={t('myAddresses.modal.addressInputPlaceholder')}
              address={account || ''}
            />
          </Box>
          <Text.p fontSize="20px" fontWeight={5} color="near-black">
            {t('myAddresses.modal.confirmInstruction')}
          </Text.p>
          <Flex mt={4}>
            <Button
              color="primary"
              onClick={handleAddClick}
              disabled={loading}
              fontWeight={4}
              mr={3}
            >
              {t('myAddresses.modal.confirm')}
            </Button>
            <Button.Outline
              color="primary"
              onClick={onClose}
              disabled={loading}
              fontWeight={4}
              border="1.5px solid"
              borderColor="primary"
            >
              {t('myAddresses.modal.cancel')}
            </Button.Outline>
          </Flex>
        </Box>
      )}
    </Dialog>
  )
}

const mapStateToProps = ({ user: { accounts } }: AppState) => ({
  accounts,
})

const mapDispatchToProps = (dispatch: DispatchWithThunk<AppState>) => ({
  updateProfile: (profile: ProfileResponse) =>
    dispatch(profileUpdated(profile)),
})

export default connect<
  NewAddressModalProps,
  NewAddressModalStateProps,
  Record<string, unknown>
>(
  mapStateToProps,
  mapDispatchToProps,
)(NewAddressModal)
