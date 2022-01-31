import React from 'react'
import { Box, Text } from 'rimble-ui'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { formatBigInt } from 'src/shared/utils/formatting'
import { prettifyBalance, recursiveRound } from 'src/shared/utils'
import Grid from '../common/Grid'

const BoxValue = styled(Text)`
  font-weight: 700;
  font-size: 22px;
  line-height: 28px;
`
const BoxLabel = styled(Text.span)`
  color: ${({ theme }) => theme.colors.grey};
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
`
export interface PoolBoxesProps {
  liquidity: number
  swapFee: number
  volume: number
  myPoolShare: number
}

const PoolBoxes = ({
  liquidity,
  myPoolShare,
  swapFee,
  volume,
}: PoolBoxesProps) => {
  const { t } = useTranslation('poolDetails')

  return (
    <Grid
      gridTemplateColumns={['1fr 1fr', '1fr 1fr', '1fr 1fr 1fr 1fr']}
      gridGap={['48px', '32px']}
      mx="1"
      mt="2"
      mb="4"
    >
      <Box>
        <BoxValue title={`$${prettifyBalance(liquidity)}`}>
          ${formatBigInt(liquidity)}
        </BoxValue>
        <BoxLabel>{t('poolBoxes.liquidity')}</BoxLabel>
      </Box>
      <Box>
        <BoxValue title={`$${prettifyBalance(volume)}`}>
          ${formatBigInt(volume)}
        </BoxValue>
        <BoxLabel>{t('poolBoxes.volume')}</BoxLabel>
      </Box>
      <Box>
        <BoxValue>{recursiveRound(swapFee)}%</BoxValue>
        <BoxLabel>{t('poolBoxes.swapFee')}</BoxLabel>
      </Box>
      <Box>
        <BoxValue>{recursiveRound(myPoolShare * 100)}%</BoxValue>
        <BoxLabel>{t('poolBoxes.myPoolShare')}</BoxLabel>
      </Box>
    </Grid>
  )
}

export default PoolBoxes
