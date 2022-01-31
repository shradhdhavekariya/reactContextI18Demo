import { ReactNode } from 'react'
import { Flash, Heading, Text, Flex, Button } from 'rimble-ui'
import { ExtractProps } from 'src/shared/types/props'

interface AlertProps extends ExtractProps<typeof Flash> {
  title: ReactNode
  children: ReactNode
  controls: ReactNode
  titleProps?: ExtractProps<typeof Heading>
  onClose?: () => void
}

const Alert = ({
  title,
  children,
  controls,
  titleProps,
  onClose,
  ...props
}: AlertProps) => (
  <>
    <Flash mb="24px" variant="info" width="100%" border="2px solid" {...props}>
      <Flex justifyItems="center" alignItems="center">
        <Heading
          as="h4"
          color="text-rare"
          fontWeight={5}
          m={0}
          {...titleProps}
          flex="1"
        >
          {title}{' '}
        </Heading>
        {onClose && (
          <Button.Text
            icononly
            bg="transparent"
            mainColor="grey"
            icon="Close"
            height="28px"
            onClick={onClose}
            zIndex={50}
            boxShadow={0}
            minWidth="0"
          />
        )}
      </Flex>
      <Text.p color="text-light" mt={2} mb={3}>
        {children}
      </Text.p>
      <Flex alignItems="center">{controls}</Flex>
    </Flash>
  </>
)

export default Alert
