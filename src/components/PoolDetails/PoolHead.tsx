import React from 'react'
import { Box, Button, Flex, Heading, Text } from 'rimble-ui'
import { useTranslation } from 'react-i18next'
import { useMediaQuery, useTheme } from '@material-ui/core'
import TokenIcon from 'src/components/common/TokenIcon'
import { ReactComponent as ExtraRewards } from 'src/assets/icons/ExtraRewards.svg'

interface PoolHeadProps {
  symbol: string
  name: string
  extraRewards: boolean
  onAddLiquidityClick: () => void
  onRemoveLiquidityClick: () => void
}

const PoolHead = ({
  symbol,
  name,
  extraRewards,
  onAddLiquidityClick,
  onRemoveLiquidityClick,
}: PoolHeadProps) => {
  const { t } = useTranslation('poolDetails')
  const theme = useTheme()
  const md = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <Heading
      my={1}
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
      flexWrap="wrap"
    >
      <Box display="flex">
        <TokenIcon symbol={symbol} name={name} width="32px" height="32px" />
        <Flex ml="2" flexDirection="column">
          <Text.span lineHeight="32px" fontSize={4} fontWeight={5} ml="8px">
            {name}
          </Text.span>
          <Text.span
            lineHeight="20px"
            fontSize="14px"
            fontWeight={5}
            ml="10px"
            color="grey"
          >
            {symbol}
          </Text.span>
        </Flex>
        {extraRewards && (
          <Flex ml="2" flexDirection="column">
            <Text.span lineHeight="32px" fontSize={4} fontWeight={5} ml="8px">
              <ExtraRewards />
            </Text.span>
          </Flex>
        )}
      </Box>
      <Flex mt={['10px', '10px', '10px', 0]} flexWrap="nowrap">
        <Button
          onClick={onAddLiquidityClick}
          title={t('addLiquidity')}
          fontWeight="600"
          fontSize="16px"
          height="40px"
          icon={md ? 'Add' : ''}
          mr="16px"
          px={['10px', '16px']}
        >
          {t('addLiquidity')}
        </Button>
        <Button
          onClick={onRemoveLiquidityClick}
          title={t('removeLiquidity')}
          fontWeight="600"
          fontSize="16px"
          height="40px"
          icon={md ? 'Remove' : ''}
          mainColor="#262626"
          px={['10px', '16px']}
        >
          {t('removeLiquidity')}
        </Button>
      </Flex>
    </Heading>
  )
}

export default PoolHead
