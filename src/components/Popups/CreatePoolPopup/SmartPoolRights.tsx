import React from 'react'
import { Card, Heading, Text, Box, Flex, Input, Flash } from 'rimble-ui'
import { useTranslation } from 'react-i18next'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'

// Will be used in the future
const SmartPoolRights = () => {
  const { t } = useTranslation('pools')
  return (
    <Card
      p="20px"
      borderRadius={1}
      boxShadow={4}
      border="0"
      display="flex"
      flexDirection="column"
      width="100%"
      height="fit-content"
    >
      <Heading
        fontSize={3}
        lineHeight="20px"
        fontWeight={5}
        mb={2}
        mt={0}
        color="grey"
      >
        {t('createPool.smartPoolRights.title')}
      </Heading>
      <FormControlLabel
        control={<Checkbox color="primary" />}
        label={
          <Text color="black" fontSize={1}>
            {t('createPool.smartPoolRights.options.1')}
          </Text>
        }
      />
      <FormControlLabel
        control={<Checkbox color="primary" />}
        label={
          <Text color="black" fontSize={1}>
            {t('createPool.smartPoolRights.options.2')}
          </Text>
        }
      />
      <FormControlLabel
        control={<Checkbox color="primary" />}
        label={
          <Text color="black" fontSize={1}>
            {t('createPool.smartPoolRights.options.3')}
          </Text>
        }
      />
      <Box pl={4}>
        <Flex alignItems="center">
          <Text color="grey" mr={3}>
            {t('createPool.smartPoolRights.minimumGradualUpdateDuration')}
          </Text>
          <Input
            type="number"
            height="36px"
            p="10px 24px 10px 8px"
            width="97px"
            fontWeight={5}
            boxShadow="none"
            bg="white"
            textAlign="right"
          />
        </Flex>
        <Flash variant="success" marginBottom={20} mt={3}>
          {t('createPool.smartPoolRights.weightRange', {
            from: 4,
            to: 96,
          })}
        </Flash>
      </Box>
      <FormControlLabel
        control={<Checkbox color="primary" />}
        label={
          <Text color="black" fontSize={1}>
            {t('createPool.smartPoolRights.options.4')}
          </Text>
        }
      />
      <FormControlLabel
        control={<Checkbox color="primary" />}
        label={
          <Text color="black" fontSize={1}>
            {t('createPool.smartPoolRights.options.5')}
          </Text>
        }
      />
      <FormControlLabel
        control={<Checkbox color="primary" />}
        label={
          <Text color="black" fontSize={1}>
            {t('createPool.smartPoolRights.options.6')}
          </Text>
        }
      />
    </Card>
  )
}

export default SmartPoolRights
