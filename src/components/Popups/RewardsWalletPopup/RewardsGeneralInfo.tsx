import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Loader } from 'rimble-ui'
import { ReactComponent as RewardsIconSVG } from 'src/assets/icons/RewardsWhite.svg'
import styled from 'styled-components'
import { ArrowForward } from '@rimble/icons'
import blotout from 'src/services/blotout'
import { Color } from 'src/theme'
import { prettifyBalance, recursiveRound } from 'src/shared/utils'
import { SmtDistributor } from 'src/contracts/SmtDistributor'
import { SmtContext } from 'src/state/SmtContext'
import useTransactionAlerts from 'src/hooks/useTransactionAlerts'
import { useAccount } from 'src/shared/web3'

interface RewardsGeneralInfoProps {
  handleChangeTab: (index: number) => void
}

const InfoHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 8px 0;
`

const InfoContent = styled.div`
  margin: 20px 0 32px 0;
`

const InfoContentItem = styled.div`
  display: flex;
  padding: 17px 0;
  justify-content: space-between;
  border-bottom: 1px solid #eff2f5;
`

const InfoContentItemLabel = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  color: #9fa3bc;
`

const InfoContentValueLabel = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 26px;
  color: ${(props) => props.color || Color.black};
`

const TitleInfoLabel = styled.p`
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 28px;
  color: ${(props) => props.color || props.theme.colors.primary};
  margin: 8px 0 0 0;
`

const PriceInfoLabel = styled.p`
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 26px;
  color: ${(props) => props.color || props.theme.colors.grey};
  margin: 0;
`

const BalanceInfoLabel = styled.p`
  font-style: normal;
  font-weight: bold;
  font-size: 32px;
  line-height: 40px;
  color: ${Color.black};
  margin: 5px 0 0 0;
`

const TokenInfoLink = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
  cursor: pointer;
`

const TokenInfoLinkLabel = styled.p`
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  color: #9fa3bc;
  margin: 0 2px 0 0;
  display: block;
`

const RewardsIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(37.2deg, #489df0 20.15%, #0179ef 87.15%);
`

const RewardsGeneralInfo = ({ handleChangeTab }: RewardsGeneralInfoProps) => {
  const [claimableBalanceLoading, setClaimableBalanceLoading] = useState(false)
  const { t } = useTranslation('pools')
  const { track } = useTransactionAlerts()
  const {
    price,
    smtBalance: {
      balanceLoading,
      total: smtSummaryBalance,
      wallet: smtWalletBalance,
      unclaimed: { erc20: claimableSmt, reload: reloadSmtClaimableBalance },
      claimInProgress,
      setClaimInProgress,
    },
  } = useContext(SmtContext)
  const account = useAccount()

  const handleClaimSMT = async () => {
    if (!account) {
      return
    }

    setClaimInProgress(true)
    try {
      const tx = await SmtDistributor.claimRewards(account)

      setClaimableBalanceLoading(true)
      await track(tx)
      await reloadSmtClaimableBalance()

      blotout.captureClaimSmtRewards(claimableSmt)
    } catch {
      // TODO: handle errors
    } finally {
      setClaimInProgress(false)
      setClaimableBalanceLoading(false)
    }
  }

  return (
    <Box mb={4}>
      <InfoHeader>
        <RewardsIcon>
          <RewardsIconSVG width={58} height={43} />
        </RewardsIcon>
        <TitleInfoLabel>{t('rewardsBalance.smtBalance')}</TitleInfoLabel>
        <TokenInfoLink onClick={() => handleChangeTab(2)}>
          <TokenInfoLinkLabel>
            {t('rewardsBalance.tokenInfo')}
          </TokenInfoLinkLabel>
          <ArrowForward size="20px" />
        </TokenInfoLink>
        {balanceLoading ? (
          <Loader mt={3} size="medium" />
        ) : (
          <>
            <BalanceInfoLabel>
              {prettifyBalance(smtSummaryBalance.erc20, 0)}
            </BalanceInfoLabel>
            <PriceInfoLabel color="grey">
              $ {prettifyBalance(smtSummaryBalance.usd)}
            </PriceInfoLabel>
          </>
        )}
      </InfoHeader>
      <InfoContent>
        <InfoContentItem>
          <InfoContentItemLabel>
            {t('rewardsBalance.walletBalance')}
          </InfoContentItemLabel>
          <InfoContentValueLabel>
            {balanceLoading ? (
              <Loader />
            ) : (
              prettifyBalance(smtWalletBalance.erc20, 0)
            )}
          </InfoContentValueLabel>
        </InfoContentItem>
        <InfoContentItem>
          <InfoContentItemLabel>
            {t('rewardsBalance.unclaimedBalance')}
          </InfoContentItemLabel>
          <InfoContentValueLabel>
            {balanceLoading || claimableBalanceLoading ? (
              <Loader />
            ) : (
              prettifyBalance(claimableSmt, 0)
            )}
          </InfoContentValueLabel>
        </InfoContentItem>
        <InfoContentItem>
          <InfoContentItemLabel>
            {t('rewardsBalance.price')}
          </InfoContentItemLabel>
          <InfoContentValueLabel>
            $ {recursiveRound(price)}
          </InfoContentValueLabel>
        </InfoContentItem>
      </InfoContent>
      <Box>
        <Button
          size="medium"
          style={{ width: '100%', height: '50px', fontWeight: 600 }}
          disabled={claimInProgress || balanceLoading || claimableSmt === 0}
          onClick={handleClaimSMT}
        >
          {claimInProgress ? (
            <Loader color="white" />
          ) : (
            t('rewardsBalance.claimBtnText', {
              balance:
                claimableSmt !== 0 ? prettifyBalance(claimableSmt, 0) : '',
            })
          )}
        </Button>
      </Box>
    </Box>
  )
}

export default RewardsGeneralInfo
