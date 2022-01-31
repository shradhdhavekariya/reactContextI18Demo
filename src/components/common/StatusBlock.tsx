import { Flex, Icon, Text } from 'rimble-ui'

const StatusBlock = ({
  iconSize,
  iconColor,
  content,
}: {
  iconSize: string
  iconColor: string
  content: string | React.ReactNode
}) => {
  return (
    <Flex alignItems="center">
      <Icon name="Lens" size={iconSize} color={iconColor} mr={1} />
      {typeof content === 'string' ? (
        <Text color="black" fontWeight={4} fontSize={2}>
          {content}
        </Text>
      ) : (
        content
      )}
    </Flex>
  )
}

export default StatusBlock
