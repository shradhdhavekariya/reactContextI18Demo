import React from 'react'
import styled from 'styled-components'
import { Icon, Flex, Button } from 'rimble-ui'
import { useTranslation } from 'react-i18next'
import { useTier } from 'src/state/hooks'
import { Tier } from 'src/shared/enums'
import LinkButton from 'src/components/common/Buttons/LinkButton'

const StyledWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 8px;
  margin-top: 24px;

  @media (min-width: ${({ theme }) => theme.breakpoints[0]}) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints[2]}) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 16px;
  }
`

interface OverviewCardsContainerProps {
  expanded?: boolean
  children: React.ReactNode
  onExpand?: () => void
}

const Completed = () => {
  const { t } = useTranslation(['onboarding'])
  return (
    <Flex lineHeight="button" color="black" fontWeight={500}>
      <Icon name="CheckCircle" alignItems="center" mr={1} />{' '}
      {t('overview.steps.completed')}
    </Flex>
  )
}

const OverviewCardsContainer = ({
  expanded = true,
  onExpand,
  children,
}: OverviewCardsContainerProps) => {
  const { t } = useTranslation(['onboarding'])
  const tier = useTier()

  return expanded ? (
    <StyledWrapper>{children}</StyledWrapper>
  ) : (
    <Flex alignItems="center" mt={4}>
      <Completed />
      <Button.Text onClick={onExpand}>{t('viewDetails')}</Button.Text>
      {tier === Tier.tier1 && (
        <LinkButton label={t('startTrading')} to="/swap" />
      )}
    </Flex>
  )
}

export default OverviewCardsContainer
