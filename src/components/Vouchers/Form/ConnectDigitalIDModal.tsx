import styled from 'styled-components'
import Checkbox from '@material-ui/core/Checkbox'
import { useEffect, useRef, useState } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { Modal, Box, Link, Card, Button, Text } from 'rimble-ui'
import FormControlLabel from '@material-ui/core/FormControlLabel'

import config from 'src/environment'
import { Yoti } from 'src/declarations'
import useScript from 'src/hooks/useScript'
import YotiButtonInit from 'src/shared/utils/yoti/init'

let yotiInitiated = false
const {
  scriptStatusUrl,
  clientSdkId,
  vouchersScenarioId: scenarioId,
} = config.yoti
const { terms, gettingStarted } = config.resources.docs

const CheckboxLabel = styled(FormControlLabel)`
  display: flex;
  align-items: center;
  margin-top: 20px;
`
const CheckboxLabelText = styled(Text)`
  font-size: 16px;
`

const CheckboxLabelLink = styled(Link)`
  font-size: 16px;
  color: #0179ef;
`

interface IConnectDigitalIDModal {
  isOpen: boolean
  setModalOpen: (isOpen: boolean) => void
  yotiTokenHandler: (token: string, done: () => void) => void
}

function ConnectDigitalIDModal({
  isOpen,
  setModalOpen,
  yotiTokenHandler,
}: IConnectDigitalIDModal) {
  const { t } = useTranslation('vouchers')
  const scriptStatus = useScript(scriptStatusUrl)
  const yotiButtonRef = useRef<HTMLDivElement>(null)

  const [termsOfServiceChecked, setTermsOfServiceChecked] = useState(false)
  const [truthfulInfoChecked, setTruthfulInfoChecked] = useState(false)
  const [privacyConsentChecked, setPrivacyConsentChecked] = useState(false)

  useEffect(() => {
    let yotiInstance: Yoti

    if (
      isOpen &&
      scriptStatus === 'ready' &&
      !yotiInitiated &&
      yotiButtonRef.current?.id
    ) {
      yotiInstance = YotiButtonInit(
        yotiButtonRef.current.id,
        {
          label: t('form.continueWithYotiDigitalID'),
          align: 'center',
          width: 'full',
        },
        scenarioId,
        clientSdkId,
        yotiTokenHandler,
        () => {
          yotiInitiated = true
        },
        'yoti-with-post-office',
        true,
      )
    }

    return () => {
      if (yotiInstance) {
        yotiInstance.destroy()
      }
      yotiInitiated = false
    }
  }, [scriptStatus, t, yotiTokenHandler, isOpen])

  const allChecked =
    termsOfServiceChecked && truthfulInfoChecked && privacyConsentChecked

  return (
    <Modal isOpen={isOpen}>
      <Card
        p={[3, 4]}
        width={[320, 450, 600]}
        display="flex"
        flexDirection="column"
      >
        <Text fontSize="24px" fontWeight="800">
          {t('form.termsAndAgreementsModalHeader')}
        </Text>
        <Button.Text
          icononly
          icon="Close"
          mainColor="grey"
          position="absolute"
          top={0}
          right={0}
          mt={3}
          mr={3}
          onClick={() => setModalOpen(false)}
        />
        <CheckboxLabel
          control={
            <Checkbox
              color="primary"
              checked={termsOfServiceChecked}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTermsOfServiceChecked(e.target.checked)
              }
            />
          }
          label={
            <CheckboxLabelText>
              <Trans
                t={t}
                i18nKey="form.tosCheckboxLabel"
                components={{
                  L1: (
                    <CheckboxLabelLink
                      href={terms.tos}
                      target="_blank"
                      hoverColor="black"
                    />
                  ),
                }}
              />
            </CheckboxLabelText>
          }
        />
        <CheckboxLabel
          control={
            <Checkbox
              color="primary"
              checked={truthfulInfoChecked}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTruthfulInfoChecked(e.target.checked)
              }
            />
          }
          label={
            <CheckboxLabelText>
              <Trans
                t={t}
                i18nKey="form.truthfulInfoCheckboxLabel"
                components={{
                  L: (
                    <CheckboxLabelLink
                      href={gettingStarted.limitations}
                      target="_blank"
                      hoverColor="black"
                    />
                  ),
                }}
              />
            </CheckboxLabelText>
          }
        />
        <CheckboxLabel
          control={
            <Checkbox
              color="primary"
              checked={privacyConsentChecked}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPrivacyConsentChecked(e.target.checked)
              }
            />
          }
          label={
            <CheckboxLabelText>
              <Trans
                t={t}
                i18nKey="form.privacyConsentCheckboxLabel"
                components={{
                  L: (
                    <CheckboxLabelLink
                      href={terms.privacy}
                      target="_blank"
                      hoverColor="black"
                    />
                  ),
                }}
              />
            </CheckboxLabelText>
          }
        />
        <Box
          style={!allChecked ? { pointerEvents: 'none', opacity: 0.5 } : {}}
          marginTop={20}
          height={110}
          width="100%"
          ref={yotiButtonRef}
          id="yoti-connect-button"
        />
      </Card>
    </Modal>
  )
}

export default ConnectDigitalIDModal
