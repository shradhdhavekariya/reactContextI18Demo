import React from 'react'
import { Box, Heading } from 'rimble-ui'

interface BlockProps {
  title: React.ReactNode
  children: React.ReactNode
}

const Block = ({ title, children, ...props }: BlockProps) => (
  <Box mb={3} {...props}>
    <Heading
      as="h5"
      mt={0}
      mb={1}
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
      flexWrap="wrap"
      color="grey"
      fontWeight={4}
      lineHeight="20px"
    >
      {title}
    </Heading>
    {children}
  </Box>
)

export default Block
