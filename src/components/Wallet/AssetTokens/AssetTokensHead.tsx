import { useTranslation } from 'react-i18next'
import WalletThead from '../WalletThead'

const AssetsHead = () => {
  const { t } = useTranslation('wallet')
  return (
    <WalletThead
      columns={[
        { id: 'asset', label: t('assetTokens.asset'), width: '40%' },
        {
          id: 'native',
          label: t('assetTokens.native'),
          justify: 'flex-end',
          width: '15%',
        },
        {
          id: 'pooled',
          label: t('assetTokens.pooled'),
          justify: 'flex-end',
          width: '15%',
        },
        { id: 'actions', justify: 'flex-end', width: '30%' },
      ]}
    />
  )
}

export default AssetsHead
