import { Flash, Text } from 'rimble-ui'
import { Redirect } from 'react-router'
import { useTranslation } from 'react-i18next'

import { FlashMessageVariant } from '../common/Feedback'

function OnboardVouchersUserMessage({
  visible,
  availableStep,
}: {
  visible: boolean
  availableStep: number
}) {
  const { t } = useTranslation('vouchers')

  if (!visible) {
    return null
  }

  if (availableStep >= 5) {
    return <Redirect to="/vouchers/list" />
  }

  return (
    <Flash variant={FlashMessageVariant.success}>
      <Text>{t('onboarding.message')}</Text>
    </Flash>
  )
}

export default OnboardVouchersUserMessage
