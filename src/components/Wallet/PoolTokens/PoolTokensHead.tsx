import { useTranslation } from 'react-i18next'
import WalletThead from '../WalletThead'

const PoolTokensHead = () => {
  const { t } = useTranslation('wallet')

  return (
    <WalletThead
      columns={[
        { id: 'asset', label: t('poolTokens.asset'), width: '55%' },
        {
          id: 'pooled',
          label: t('poolTokens.pooled'),
          justify: 'flex-end',
          width: '15%',
        },
        { id: 'actions', justify: 'flex-end', width: '30%' },
      ]}
    />
  )
}

export default PoolTokensHead
