import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Button, Flash, Flex, Text, Box, Link } from 'rimble-ui'
import { Icon } from '@rimble/icons'
import Translate from 'src/components/common/Translate'
import Dialog from 'src/components/common/Dialog'
import config from 'src/environment'
import VerifyAddressButton from '../common/Buttons/VerifyAddressButton'

const { passportLinkingYourWallet } = config.resources.docs.coreConcepts

const Address = styled(Text.p)`
  word-break: break-all;
`

interface ConnectedSuccessfullyModalProps {
  address: string
  onClose: () => void
  onNext?: () => void
  nextButtonLabel?: React.ReactNode
}

const ConnectedSuccessfullyModal = ({
  address,
  onClose,
  onNext,
  nextButtonLabel = (
    <Translate namespaces={['modals']}>
      successfullyConnectedModal.signButton
    </Translate>
  ),
}: ConnectedSuccessfullyModalProps) => {
  const { t } = useTranslation(['modals'])

  return (
    <Dialog
      isOpen
      onClose={onClose}
      width={['100%', '440px']}
      title={t('successfullyConnectedModal.header')}
    >
      <Flash variant="success">
        <Flex>
          <Icon name="Check" />
          <Text.span ml={2} fontWeight={5}>
            {t('successfullyConnectedModal.status')}
          </Text.span>
        </Flex>
      </Flash>
      <Address mt="24px" mb="16px" fontWeight={5}>
        {address}
      </Address>

      <Text.p my={0}>{t('successfullyConnectedModal.instruction')}</Text.p>

      <Box mt="24px">
        {onNext ? (
          <>
            <VerifyAddressButton
              render={(verify) => (
                <Button
                  size="medium"
                  px={3}
                  width="fit-content"
                  color="primary"
                  onClick={async () => {
                    await verify()
                    onClose()
                  }}
                >
                  {nextButtonLabel}
                </Button>
              )}
            />
            <Link
              px={3}
              ml={3}
              href={passportLinkingYourWallet}
              title={t('successfullyConnectedModal.instructionLink')}
              color="primary"
              hoverColor="primary-dark"
              fontWeight={2}
              lineHeight="copy"
              fontSize="inherit"
            >
              {t('successfullyConnectedModal.instructionLink')}
            </Link>
          </>
        ) : (
          <Button
            size="medium"
            px={3}
            width="fit-content"
            color="primary"
            onClick={onClose}
          >
            {t('successfullyConnectedModal.closeButton')}
          </Button>
        )}
      </Box>
    </Dialog>
  )
}

export default ConnectedSuccessfullyModal
