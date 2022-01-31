import { useHistory } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Flash, Button, Text } from 'rimble-ui'
import { ExtractProps } from 'src/shared/types/props'
import { ReactComponent as PassportIcon } from 'src/assets/icons/Passport.svg'
import config from 'src/environment'
import Alert from './Alert'
import AlertLink from './AlertLink'

const { passport: passportLink } = config.resources.docs.coreConcepts

const CompletePassportAlert = (props: ExtractProps<typeof Flash>) => {
  const { push } = useHistory()
  const { t } = useTranslation(['alerts'])

  const handleButtonClick = () => {
    push('/onboarding')
  }
  return (
    <Alert
      title={t('completePassport.title')}
      controls={
        <>
          <Button
            onClick={handleButtonClick}
            size="medium"
            px={3}
            mr="24px"
            fontWeight={4}
            lineHeight="20px"
          >
            <Text.span mr={2}>
              <PassportIcon height="18px" style={{ paddingTop: '1px' }} />
            </Text.span>

            {t('completePassport.button')}
          </Button>
          <AlertLink href={passportLink} target="_blank">
            {t('completePassport.link')}
          </AlertLink>
        </>
      }
      {...props}
    >
      {t('completePassport.content')}
    </Alert>
  )
}

export default CompletePassportAlert
