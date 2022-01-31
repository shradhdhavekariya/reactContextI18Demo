import { useEffect, useState } from 'react'
import { Link } from 'rimble-ui'
import { useTranslation } from 'react-i18next'
import api from 'src/services/api'
import Alert from 'src/components/common/AlertPanel/Alert'
import Divider from 'src/components/common/Divider'
import config from 'src/environment'

const { coreConcepts } = config.resources.docs

const usAlertDismissed = sessionStorage.getItem('us_alert_dismissed')

const USAlert = () => {
  const { t } = useTranslation(['onboarding'])
  const [isUSUser, setIsUSUser] = useState(false)

  useEffect(() => {
    if (usAlertDismissed) {
      return
    }

    const locationUser = async () => {
      try {
        const { attributes } = await api.location()
        setIsUSUser(attributes.country_code === 'US')
      } catch (error) {
        // @todo notify user
      }
    }

    locationUser()
  }, [])

  const handleClose = () => {
    setIsUSUser(false)
    sessionStorage.setItem('us_alert_dismissed', '1')
  }

  return isUSUser ? (
    <>
      <Alert
        onClose={handleClose}
        my={3}
        maxWidth={['auto', 'auto', '1028px']}
        title={t('overview.usAlert.title')}
        titleProps={{
          color: 'primary',
        }}
        controls={
          <Link
            href={coreConcepts.passport}
            title="Learn more"
            color="primary"
            hoverColor="primary-dark"
            fontSize={2}
            fontWeight={4}
            style={{ textDecoration: 'underline' }}
          >
            {t('overview.usAlert.link')}
          </Link>
        }
      >
        {t('overview.usAlert.content')}
      </Alert>
      <Divider />
    </>
  ) : null
}

export default USAlert
