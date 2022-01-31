import { Flex, Icon, Text } from 'rimble-ui'
import { useTranslation } from 'react-i18next'
import { ExtractProps } from 'src/shared/types/props'

const Pending = (props: ExtractProps<typeof Flex>) => {
  const { t } = useTranslation('onboarding')
  return (
    <Flex color="primary" alignItems="center" {...props}>
      <Icon name="AccessTime" mr={2} size="28px" />
      <Text.span lineHeight="button">
        {t('overview.steps.cards.3.pending')}
      </Text.span>
    </Flex>
  )
}

export default Pending
