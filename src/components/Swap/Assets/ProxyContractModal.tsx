import { useTranslation } from 'react-i18next'
import { Button, Box, Flash, Text, Flex, Icon, Link } from 'rimble-ui'
import Dialog from 'src/components/common/Dialog'
import config from 'src/environment'

const { coreConcepts } = config.resources.docs

interface ProxyContractModalProps {
  isOpen: boolean
  onResolve: () => void
  onReject: () => void
}

const ProxyContractModal = ({
  isOpen,
  onResolve,
  onReject,
}: ProxyContractModalProps) => {
  const { t } = useTranslation('swap')
  return (
    <Dialog
      isOpen={isOpen}
      width={['100%', '440px']}
      onClose={onReject}
      title={t('proxyContractModal.header')}
    >
      <Box>
        <Flash
          my={3}
          variant="info"
          width="100%"
          border="2px solid"
          maxWidth={['auto', 'auto', '1028px']}
          mb="24px"
        >
          <Flex>
            <Icon name="ErrorOutline" color="primary-dark" />
            <Text.p color="primary-dark" fontWeight={5} my={0} ml={2}>
              {t('proxyContractModal.flash')}
            </Text.p>
          </Flex>
        </Flash>
        <Text>{t('proxyContractModal.content')}</Text>
        <Link
          href={coreConcepts.swaps}
          color="primary"
          hoverColor="dark-gray"
          fontSize={2}
          fontWeight={3}
        >
          {t('proxyContractModal.link')}
        </Link>
        <Box mt="24px">
          <Button size="medium" onClick={onResolve}>
            {t('proxyContractModal.continue')}
          </Button>
          <Button.Outline size="medium" ml={3} onClick={onReject}>
            {t('proxyContractModal.cancel')}
          </Button.Outline>
        </Box>
      </Box>
    </Dialog>
  )
}

export default ProxyContractModal
