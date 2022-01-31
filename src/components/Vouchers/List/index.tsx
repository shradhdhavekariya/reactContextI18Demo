import qs from 'query-string'
import { useState } from 'react'
import styled from 'styled-components'
import { Tabs } from '@material-ui/core'
import { Flex, Button } from 'rimble-ui'
import { useTranslation } from 'react-i18next'
import { Redirect, useHistory, useLocation } from 'react-router'

import { IVoucherResponse } from 'src/components/Vouchers/interfaces'
import VoucherCard from 'src/components/Vouchers/List/VoucherCard'
import StyledTab from 'src/components/common/StyledTab'
import Content from 'src/components/common/Content'
import Layout from 'src/components/common/Layout'

import useRequest from 'src/hooks/useRequest'
import useTimeout from 'src/hooks/useTimeout'
import api from 'src/services/api'

const VOUCHER_STATUSES = ['approved', 'redeem_pending', 'redeemed']

const HeaderButton = styled(Button)`
  bottom: 80px;

  @media (max-width: 831px) {
    bottom: 63px;
  }
`

const VouchersList = () => {
  const history = useHistory()
  const { search } = useLocation()
  const { t } = useTranslation('vouchers')
  const [activeTabIndex, setActiveTabIndex] = useState(0)

  const { data, refetch, error } = useRequest<
    () => Promise<IVoucherResponse[]>
  >(api.getVouchersList)

  const { newVoucherID } = qs.parse(search)

  useTimeout(
    () => {
      history.push('/vouchers/list')
    },
    newVoucherID ? 5000 : null,
  )

  const handleBuyMoreClick = () => {
    history.push('/vouchers')
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleTabChange = (e: React.ChangeEvent<{}>, index: number) => {
    setActiveTabIndex(index)
  }

  const getTabs = () => {
    return VOUCHER_STATUSES.map((status, index) => {
      const vouchers = data?.filter((v) => v.attributes.status === status) || []
      const title = t(`${'vouchersList.sectionTitles'}.${status}`)

      return (
        <StyledTab
          key={`tab-${title}`}
          label={title}
          amountIn={vouchers.length}
          value={index}
        />
      )
    })
  }

  if (error) {
    return <Redirect to="/vouchers" />
  }

  const vouchers =
    data?.filter(
      (v) => v.attributes.status === VOUCHER_STATUSES[activeTabIndex],
    ) || []

  return (
    <Layout
      header={t('vouchersList.header')}
      subheader={
        <Flex flex="1" flexDirection="column">
          <Tabs
            value={activeTabIndex}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleTabChange}
            aria-label="Voucher tabs"
          >
            {getTabs()}
          </Tabs>
          <HeaderButton
            position="absolute"
            width="120px"
            fontWeight="600"
            height="37px"
            alignSelf="flex-end"
            onClick={handleBuyMoreClick}
          >
            Buy More
          </HeaderButton>
        </Flex>
      }
    >
      <Content bg="background">
        <Flex flexWrap="wrap" flexDirection="column" width="100%">
          <Flex flexWrap="wrap" flexDirection="row" width="100%">
            {vouchers.map((voucher) => (
              <VoucherCard
                key={`voucher-${voucher.id}`}
                data={voucher}
                refetch={refetch}
                animate={voucher.id.toString() === newVoucherID}
              />
            ))}
          </Flex>
        </Flex>
      </Content>
    </Layout>
  )
}

export default VouchersList
