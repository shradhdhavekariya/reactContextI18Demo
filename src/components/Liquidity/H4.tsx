import React from 'react'
import { Heading } from 'rimble-ui'

interface H4Props {
  text: React.ReactNode
}
const H4 = ({ text }: H4Props) => (
  <Heading
    as="h4"
    mt={0}
    mb={3}
    display="flex"
    justifyContent="space-between"
    alignItems="flex-start"
    flexWrap="wrap"
    color="grey"
    fontWeight={5}
  >
    {text}
  </Heading>
)

export default H4
