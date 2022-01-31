import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { Heading, Text, Button, Box, Flex, Loader } from 'rimble-ui'
import Dialog from 'src/components/common/Dialog'
import { usePolygonBridge } from 'src/services/polygon-bridge'
import api from 'src/services/api'
import { useAccount, useConnectWallet } from 'src/shared/web3'
import { useSnackbar } from 'src/components/common/Snackbar'
import SmartButton from 'src/components/common/Buttons/SmartButton'
import { KnownError } from 'src/services/error-handler'
import Divider from 'src/components/common/Divider'
import InfoLink from 'src/components/Wallet/InfoLink'
import { ReactComponent as PolygonIcon } from 'src/assets/icons/PolygonLogo.svg'
import useEffectCompare from 'src/shared/hooks/useEffectCompare'
import useLocalStorage from 'src/hooks/useLocalStorage'
import useTransactionAlerts from 'src/hooks/useTransactionAlerts'
import config from 'src/environment'
import { POLYGON_INFO_LOCAL_STORAGE_KEY } from './consts'

const { faq } = config.resources.docs.gettingStarted

interface PolygonInfoPopupProps {
  isOpen: boolean
  onClose: () => void
}

const PolygonInfoPopup = ({ isOpen, onClose }: PolygonInfoPopupProps) => {
  const { t } = useTranslation(['popups', 'transaction'])
  const account = useAccount()
  const connect = useConnectWallet()
  const [shouldAutoRequest, setShouldAutoRequest] = useState(false)
  const [alreadyRequested, setAlreadyRequested] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useLocalStorage(
    POLYGON_INFO_LOCAL_STORAGE_KEY,
    (val) => val === 'true',
  )
  const { addError } = useSnackbar()
  const { track } = useTransactionAlerts()
  const showBridge = usePolygonBridge()

  const requestMaticToken = useCallback(
    async (address: string) => {
      try {
        const response = await api.requestMaticFromFaucet(address)

        if (response.attributes.tx_hash) {
          await track(response.attributes.tx_hash, {
            skipSubmit: true,
            confirm: {
              message: t('polygonInfo.maticSent'),
            },
          })
        }
      } catch (e) {
        addError(e as KnownError)
      } finally {
        setAlreadyRequested(true)
      }
    },
    [addError, t, track],
  )

  const handleRequestButtonClick = useCallback(async () => {
    if (alreadyRequested) {
      return
    }

    if (!account) {
      const success = await connect()

      if (success) {
        setShouldAutoRequest(true)
      } else {
        addError(new Error(t('polygonInfo.pleaseConnect')))
      }
    } else {
      await requestMaticToken(account)
    }
  }, [account, addError, alreadyRequested, connect, requestMaticToken, t])

  const handleOnClose = useCallback(() => {
    onClose()
  }, [onClose])

  const handleBridgeClick = useCallback(() => {
    setDontShowAgain('true')
    handleOnClose()
    showBridge()
  }, [handleOnClose, setDontShowAgain, showBridge])

  const handleDontShowAgainCheckboxChange = useCallback(
    (e) => {
      setDontShowAgain(e.target.checked ? e.target.value : null)
    },
    [setDontShowAgain],
  )

  useEffect(() => {
    if (shouldAutoRequest && !alreadyRequested && account) {
      requestMaticToken(account)
    }
  }, [
    account,
    alreadyRequested,
    requestMaticToken,
    setAlreadyRequested,
    shouldAutoRequest,
  ])

  useEffectCompare(() => {
    setAlreadyRequested(false)
  }, [account])

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      width={['100%', '600px']}
      justifyContent="flex-start"
      alignItems="center"
    >
      <PolygonIcon style={{ flex: '1 0 100px', marginBottom: '16px' }} />
      <Heading
        as="h4"
        fontSize="20px"
        fontWeight="bold"
        lineHeight="28px"
        m={0}
        mb={1}
      >
        {t('polygonInfo.title')}
      </Heading>

      <Text.span
        as="h4"
        fontSize="14px"
        fontWeight="bold"
        m={0}
        lineHeight="24px"
        width="200px"
      >
        {t('polygonInfo.subtitle')}
      </Text.span>

      <Text.span
        as="h4"
        fontSize="20px"
        fontWeight="bold"
        color="grey"
        m={0}
        my={4}
      >
        {t('polygonInfo.howToGetStarted')}
      </Text.span>

      <Box width="100%">
        <Text.span fontSize="16px" color="grey" lineHeight="24px" m={0} my={3}>
          {t('polygonInfo.instruction1_1')}
          <PolygonIcon
            height="24px"
            width="24px"
            style={{
              flex: '1 0 24px',
              display: 'inline-block',
              marginRight: '8px',
              marginLeft: '8px',
              verticalAlign: 'sub',
            }}
          />
          {t('polygonInfo.instruction1_2')}
          <SmartButton
            disabled={alreadyRequested}
            onClick={handleRequestButtonClick}
            component={Button.Text}
            requireAccount
            requireLogin
            loadingText={<Loader />}
          >
            {t(
              alreadyRequested
                ? 'polygonInfo.alreadyRequested'
                : 'polygonInfo.instruction1action',
            )}
          </SmartButton>
        </Text.span>
        <Divider my={2} />
        <Text.span fontSize="16px" color="grey" m={0} my={3}>
          {t('polygonInfo.instruction2')}
          <SmartButton component={Button.Text} onClick={handleBridgeClick}>
            {t('polygonInfo.instruction2action')}
          </SmartButton>
        </Text.span>
      </Box>

      <InfoLink href={faq} m={0} my={4}>
        {t('polygonInfo.learnAboutOtherWays')}
      </InfoLink>

      <Divider my={4} />

      <Flex direction="row" width="100%">
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              onChange={handleDontShowAgainCheckboxChange}
              value="true"
              checked={dontShowAgain}
            />
          }
          label={
            <Text.span fontSize="16px" color="grey" m={0} my={3}>
              {t('polygonInfo.dontShowAgain')}
            </Text.span>
          }
        />
        <Button.Text
          m={0}
          p={0}
          mainColor="grey"
          fontSize={2}
          fontWeight={2}
          style={{ textDecoration: 'underline' }}
          onClick={handleOnClose}
        >
          {t('polygonInfo.close')}
        </Button.Text>
      </Flex>
    </Dialog>
  )
}

export default PolygonInfoPopup
export { POLYGON_INFO_LOCAL_STORAGE_KEY } from './consts'
