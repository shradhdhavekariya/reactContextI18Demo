import React from 'react'
import { Button, Flex, Tooltip } from 'rimble-ui'
import styled from 'styled-components'
import { Color } from 'src/theme'
import { useTranslation } from 'react-i18next'

interface TitleLabelProps {
  title: string
  content: React.ReactNode
}

const TitleLabel = styled.p`
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 28px;
  color: ${Color.grey};
  margin: 0 8px 0 0;
`

const RewardsPopupSectionTitle = ({ title, content }: TitleLabelProps) => {
  const { t } = useTranslation('pools')
  return (
    <Flex style={{ alignItems: 'center' }}>
      <TitleLabel>{title}</TitleLabel>
      <Tooltip
        placement="top"
        message={t('rewardsBalance.loyaltyLevelTooltip')}
      >
        <Button variant="plain" height="16px" icononly icon="Help" />
      </Tooltip>
      {content}
    </Flex>
  )
}

export default RewardsPopupSectionTitle
