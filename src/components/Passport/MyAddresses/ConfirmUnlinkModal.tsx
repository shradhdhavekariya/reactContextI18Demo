import { ChangeEvent, useState } from 'react'
import Checkbox from '@material-ui/core/Checkbox'
import { useTranslation } from 'react-i18next'
import { Box, Button, Flex, Text } from 'rimble-ui'
import Blockie from 'src/components/common/Blockie'
import Dialog from 'src/components/common/Dialog'
import { useAccount } from 'src/shared/web3'
import { truncateStringInTheMiddle } from 'src/utils'
import { AddressItem } from './NewAddressModal'

interface ConfirmUnlinkModalProps {
  address: string
  isOpen: boolean
  onCancel: () => void
  onConfirm: () => void
}

const ConfirmUnlinkModal = ({
  address,
  isOpen,
  onCancel,
  onConfirm,
}: ConfirmUnlinkModalProps) => {
  const { t } = useTranslation('passport')
  const [isChecked, setChecked] = useState<boolean>(false)
  const account = useAccount()

  return (
    <Dialog
      isOpen={isOpen}
      width={['100%', '540px']}
      height="auto"
      maxHeight="80%"
      onClose={onCancel}
      title={t('myAddresses.unlinkConfirmationHeading')}
    >
      <Box>
        <Text.p>
          <Text.span color="grey">
            {t('myAddresses.unlinkConfirmationDescription')}
          </Text.span>
        </Text.p>
        <AddressItem>
          <Blockie address={address ?? account} />
          <Text.p fontSize="18px" my={0}>
            ({truncateStringInTheMiddle(address ?? account ?? '')})
          </Text.p>
        </AddressItem>
        <Box mt={4} display="flex" flexDirection="row">
          <Checkbox
            disableRipple
            color="primary"
            checked={isChecked}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setChecked(e.target.checked)
            }
          />
          <Box>
            <Text.span>{t('myAddresses.modal.confirmation')}</Text.span>
          </Box>
        </Box>
        <Flex mt={4}>
          <Button
            disabled={!isChecked}
            mainColor="black"
            onClick={onConfirm}
            fontWeight={4}
            mr={3}
          >
            {t('myAddresses.modal.unlink')}
          </Button>
          <Button.Outline
            color="primary"
            onClick={onCancel}
            fontWeight={4}
            border="1.5px solid"
            borderColor="primary"
          >
            {t('myAddresses.modal.cancel')}
          </Button.Outline>
        </Flex>
      </Box>
    </Dialog>
  )
}

export default ConfirmUnlinkModal
