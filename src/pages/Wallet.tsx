import { useState } from 'react'
import { Box } from 'rimble-ui'
import { useTranslation } from 'react-i18next'
import Layout from 'src/components/common/Layout'
import Content from 'src/components/common/Content'
import AssetTokens from 'src/components/Wallet/AssetTokens'
import PoolTokens from 'src/components/Wallet/PoolTokens'
import WalletSelector from 'src/components/Wallet/WalletSelector'
import HeaderActions from 'src/components/common/HeaderActions'
import AlertPanel from 'src/components/common/AlertPanel'
import LoyaltyBanner from 'src/components/Wallet/LoyaltyLevelBanner'
import ProxyTokens from 'src/components/Wallet/ProxyTokens'
import { Tier } from 'src/shared/enums'
import { useTier } from 'src/state/hooks'
import { WalletContextProvider } from '../components/Wallet/WalletContext'

const Wallet = () => {
  const { t } = useTranslation('wallet')
  const [showPopup, setShowPopup] = useState(false)
  const tier = useTier()

  return (
    <Layout
      header={t('header')}
      headerActions={
        <HeaderActions
          passport
          addLiquidity
          wallet
          showPopup={showPopup}
          setShowPopup={setShowPopup}
        />
      }
    >
      <Content bg="background">
        <AlertPanel promptSignIn={tier === Tier.tier2} />
        <WalletContextProvider>
          <WalletSelector />
          <LoyaltyBanner setShowPopup={setShowPopup} />
          <Box width="100%">
            <AssetTokens mt={[3, 4]} />
            <ProxyTokens mt={[3, 4]} />
            <PoolTokens mt={[3, 4]} />
          </Box>
        </WalletContextProvider>
      </Content>
    </Layout>
  )
}

export default Wallet
