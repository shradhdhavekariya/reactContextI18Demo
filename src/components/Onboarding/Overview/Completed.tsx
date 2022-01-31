import { useTranslation } from 'react-i18next'
import { Text } from 'rimble-ui'

const Completed = () => {
  const { t } = useTranslation(['onboarding'])
  return (
    <Text color="grey" lineHeight="button">
      {t('overview.steps.completed')}
    </Text>
  )
}

export default Completed
