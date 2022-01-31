import { Card, Flash, Flex, Icon, Text, Box, Heading } from 'rimble-ui'
import theme from 'src/theme'

export enum FlashMessageVariant {
  success = 'success',
  warning = 'warning',
  danger = 'danger',
}

const iconVariantMap = {
  [FlashMessageVariant.success]: 'Check',
  [FlashMessageVariant.warning]: 'InfoOutline',
  [FlashMessageVariant.danger]: 'Close',
}

interface KycFeedbackModalProps {
  title?: string
  body?: React.ReactNode | string
  flashMessage?: string
  flashMessageVariant?: FlashMessageVariant
  controls?: React.ReactNode | string
}

const Feedback = ({
  title,
  body,
  flashMessage,
  flashMessageVariant,
  controls,
}: KycFeedbackModalProps) => (
  <Card width={['100%', '440px']} p={4} borderRadius={1}>
    {title && (
      <Heading as="h4" fontSize={4} fontWeight={5} mt={0}>
        {title}
      </Heading>
    )}
    {flashMessage && (
      <Flash my={4} variant={flashMessageVariant} theme={theme}>
        <Flex>
          {flashMessageVariant && (
            <Icon name={iconVariantMap[flashMessageVariant]} />
          )}
          <Text.span ml={2} fontWeight={5}>
            {flashMessage}
          </Text.span>
        </Flex>
      </Flash>
    )}
    {body && <Box>{body}</Box>}
    {controls && <Box mt="24px">{controls}</Box>}
  </Card>
)

export default Feedback
