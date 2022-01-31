import { useContext } from 'react'
import { Loader } from 'rimble-ui'
import styled from 'styled-components'
import { prettifyBalance } from 'src/shared/utils'
import { SmtContext } from 'src/state/SmtContext'
import { ReactComponent as RewardsWhiteIconSVG } from 'src/assets/icons/RewardsWhite.svg'

const RewardsWalletBalance = styled.div<SmtRewardsProps>`
  display: flex;
  background-color: ${({ theme }) => theme.colors['off-white']};
  border-radius: 76px;
  flex-direction: row;
  align-items: center;
  padding: 3px 4px 3px 3px;
  cursor: pointer;
  margin-right: 12px;
`

const RewardsIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  background: #2b79ef;
  border-radius: 50%;
`

const RewardsLabel = styled.div`
  flex: 1;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  padding: 0 8px;
`

interface SmtRewardsProps {
  onClick: () => void
}

const SmtRewardsBadge = ({ onClick }: SmtRewardsProps) => {
  const {
    smtBalance: {
      balanceLoading,
      total: { erc20: smtSummaryBalance },
    },
  } = useContext(SmtContext)

  return (
    <RewardsWalletBalance onClick={onClick}>
      <RewardsIcon>
        <RewardsWhiteIconSVG width="15px" height="11px" />
      </RewardsIcon>
      <RewardsLabel>
        {balanceLoading ? (
          <Loader />
        ) : (
          prettifyBalance(smtSummaryBalance || 0, 0)
        )}
      </RewardsLabel>
    </RewardsWalletBalance>
  )
}

export default SmtRewardsBadge
