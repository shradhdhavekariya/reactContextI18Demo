import { Card, Flex, Heading } from 'rimble-ui'
import { MarginProps } from 'styled-system'

interface WalletSectionProps extends MarginProps {
  title: string
  children: React.ReactNode
  badge?: React.ReactNode
}
const WalletSection = ({
  title,
  badge,
  children,
  ...props
}: WalletSectionProps) => {
  return (
    <Card
      p={[3, '24px']}
      borderRadius={1}
      boxShadow={4}
      border="0"
      width="100%"
      flexDirection="column"
      {...props}
    >
      <Flex
        alignItems="center"
        justifyContent={['space-between', 'flex-start']}
      >
        <Heading
          as="h3"
          fontSize={[2, 3]}
          lineHeight={['24px', '28px']}
          fontWeight={5}
          color="grey"
          m={0}
          ml={[2, '12px']}
          flexGrow="1"
        >
          {title}
        </Heading>
        {badge}
      </Flex>
      {children}
    </Card>
  )
}

export default WalletSection
