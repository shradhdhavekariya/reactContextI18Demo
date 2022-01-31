import { useTranslation } from 'react-i18next'
import Alert from 'src/components/common/AlertPanel/Alert'
import AlertLink from 'src/components/common/AlertPanel/AlertLink'
import config from 'src/environment'

const { coreConcepts } = config.resources.docs

const VerifyIdentityFAQ = () => {
  const { t } = useTranslation(['onboarding'])

  return (
    <Alert
      title={t('verifyIdentity.faq.title')}
      controls={
        <AlertLink href={coreConcepts.passport} target="_blank">
          {t('verifyIdentity.faq.link')}
        </AlertLink>
      }
      mt="48px"
    >
      {t('verifyIdentity.faq.description')}
    </Alert>
  )
}

export default VerifyIdentityFAQ
