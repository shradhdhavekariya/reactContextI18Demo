import { useTranslation } from 'react-i18next'
import { Flash, Button, Text } from 'rimble-ui'
import { ExtractProps } from 'src/shared/types/props'
import { ReactComponent as PassportIcon } from 'src/assets/icons/Passport.svg'
import React from 'react'
import config from 'src/environment'
import Alert from './Alert'
import AlertLink from './AlertLink'
import VerifyAddressButton from '../Buttons/VerifyAddressButton'

const { passportLinkingYourWallet } = config.resources.docs.coreConcepts

const CompleteSignInAlert = (props: ExtractProps<typeof Flash>) => {
  const { t } = useTranslation(['alerts'])

  return (
    <Alert
      title={t('signIn.title')}
      controls={
        <>
          <VerifyAddressButton
            render={(verify) => (
              <Button
                onClick={verify}
                size="medium"
                px={3}
                mr="24px"
                fontWeight={4}
                lineHeight="20px"
              >
                <Text.span mr={2}>
                  <PassportIcon height="18px" style={{ paddingTop: '1px' }} />
                </Text.span>

                {t('signIn.button')}
              </Button>
            )}
          />
          <AlertLink href={passportLinkingYourWallet} target="_blank">
            {t('signIn.link')}
          </AlertLink>
        </>
      }
      {...props}
    >
      {t('signIn.content')}
    </Alert>
  )
}

export default CompleteSignInAlert
