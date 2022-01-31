import { useTranslation } from 'react-i18next'
import TextWithTooltip from 'src/components/common/Text/TextWithTooltip'
import WalletThead from '../WalletThead'

const ProxyTokensHead = () => {
  const { t } = useTranslation('wallet')
  return (
    <WalletThead
      columns={[
        { id: 'assets', label: t('proxyTokens.assets'), width: '55%' },
        {
          id: 'balance',
          label: (
            <TextWithTooltip tooltip={t('proxyTokens.tooltip')}>
              {t('proxyTokens.balance')}
            </TextWithTooltip>
          ),
          justify: 'flex-end',
          width: '15%',
        },
        { id: 'actions', justify: 'flex-end', width: '30%' },
      ]}
    />
  )
}

export default ProxyTokensHead
