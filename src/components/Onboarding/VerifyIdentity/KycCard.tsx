import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Flex, Box, Heading, Text } from 'rimble-ui'
import VendorIcon from './VendorIcon'

const StyledList = styled.ul`
  list-style-type: none;
  padding: 0;

  li {
    margin-bottom: 8px;
  }
`

interface KycCardProps {
  vendor: string
  button: React.ReactNode
}

const KycCard = ({ vendor, button }: KycCardProps) => {
  const { t } = useTranslation(['onboarding'])

  return (
    <Flex
      flexDirection="column"
      justifyContent="space-between"
      alignItems="center"
      width="100%"
      maxWidth={['unset', '386px']}
      p="24px"
      bg="white"
      mt={[3, 3, 0]}
      boxShadow={4}
      borderRadius={1}
    >
      <VendorIcon vendor={vendor} />
      <Heading as="h1" color="black" fontWeight={2} mt="24px">
        {t(`verifyIdentity.cards.${vendor}.title`)}
      </Heading>
      <Box alignSelf={['flex-start']} width="100%" mb="auto">
        <StyledList>
          <li>
            <Text>{t(`verifyIdentity.cards.${vendor}.feature1`)}</Text>
          </li>
          <li>
            <Text>{t(`verifyIdentity.cards.${vendor}.feature2`)}</Text>
          </li>
        </StyledList>
      </Box>
      <Box alignSelf={['flex-start']} width="100%">
        {button}
      </Box>
    </Flex>
  )
}

export default KycCard
