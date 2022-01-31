import { useTranslation } from 'react-i18next'
import { Flex } from 'rimble-ui'

import api from 'src/services/api'
import useRequest from 'src/hooks/useRequest'
import { IVoucherResponse } from 'src/components/Vouchers/interfaces'
import VoucherCard from 'src/components/Vouchers/List/VoucherCard'
import WalletSection from '../WalletSection'

function VouchersSection() {
  const { t } = useTranslation('vouchers')
  const { data, refetch } = useRequest<() => Promise<IVoucherResponse[]>>(
    api.getVouchers,
  )

  if (!data || data.length === 0) {
    return null
  }

  return (
    <WalletSection mb="24px" title={t('vouchers.header')}>
      <Flex flexDirection="row" flexWrap="wrap" justifyContent="center">
        {data?.map((voucher) => (
          <VoucherCard
            size="small"
            key={`voucher-${voucher.id}`}
            data={voucher}
            refetch={refetch}
          />
        ))}
      </Flex>
    </WalletSection>
  )
}

export default VouchersSection
