import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, useHistory, useLocation } from 'react-router'
import { Flex, Text, Link } from 'rimble-ui'

import api from 'src/services/api'
import { getVouchersYotiTokenResponse } from 'src/utils'
import Content from 'src/components/common/Content'
import Layout from 'src/components/common/Layout'
import resources from 'src/environment/resources'
import useInterval from 'src/hooks/useInterval'
import { useSnackbar } from 'src/components/common/Snackbar'
import createWidgetURL from './createWidgetURL'
import { IVoucherFormState } from '../interfaces'

const StyledIFrame = styled.iframe`
  width: 100%;
  height: 400px;
  max-width: 500px;
  margin: 0 auto;
  z-index: 2;
  position: relative;

  @media (min-height: 768px) {
    height: 568px;
  }

  @media (min-height: 900px) {
    height: 700px;
  }

  @media (min-height: 1024px) {
    height: 824px;
  }

  @media (min-height: 1280px) {
    height: 1080px;
  }
`
const TRANSACTION_COMPLETION_POLL_TIME = 1000

function MoonPayWidget() {
  const history = useHistory()
  const { addError } = useSnackbar()
  const { t } = useTranslation('vouchers')
  const location = useLocation<IVoucherFormState>()
  const [widgetURL, setWidgetURL] = useState('')
  const [shouldStopPolling, setShouldStopPolling] = useState(false)
  const yotiTokenResponse = getVouchersYotiTokenResponse()
  const { cryptoBase, voucherValue, fiat, transactionId } = location.state || {}

  async function checkTransactionStatus() {
    try {
      const txResponse = await api.getMoonPayTransactionStatus(transactionId)

      if (txResponse.attributes.status === 'completed') {
        const lastVoucherResponse = await api.getMostRecentlyCreatedVoucher()
        history.push(`/vouchers/list?newVoucherID=${lastVoucherResponse[0].id}`)
      } else if (txResponse.attributes.status === 'failed') {
        addError(new Error(txResponse.attributes.failure_reason), {
          description: txResponse.attributes.failure_reason,
          actionText: t('payment.errorActionButton'),
          actionHref: '/vouchers',
          actionHrefOpenInSameTab: true,
          autoDismissible: false,
        })
        setShouldStopPolling(true)
      }
      // eslint-disable-next-line no-empty
    } catch {}
  }

  useEffect(() => {
    if (yotiTokenResponse) {
      const { email, remember_me_id } = yotiTokenResponse

      createWidgetURL(
        transactionId,
        email,
        remember_me_id,
        cryptoBase,
        voucherValue,
        fiat,
      ).then(setWidgetURL)
    }
  }, [yotiTokenResponse, cryptoBase, voucherValue, fiat, transactionId])

  useInterval(
    checkTransactionStatus,
    shouldStopPolling ? null : TRANSACTION_COMPLETION_POLL_TIME,
  )

  if (!yotiTokenResponse || !location.state) {
    return <Redirect to="/vouchers" />
  }

  return (
    <Layout
      header={t('payment.header')}
      subheader={
        <>
          {t('payment.subheader')}
          <Link href={resources.docs.coreConcepts.vouchers} target="_blank">
            {t('payment.learnMoreLink')}
          </Link>
        </>
      }
    >
      <Content bg="background">
        <Flex flex="1" width="100%" height="100%" position="relative">
          <Text
            position="absolute"
            width="100px"
            textAlign="center"
            left="calc(50% - 50px)"
            top="30%"
          >
            {t('payment.widgetLoadingText')}
          </Text>
          {widgetURL && (
            <StyledIFrame
              title="moonpay"
              src={widgetURL}
              allow="accelerometer; autoplay; camera; gyroscope; payment"
              frameBorder="0"
            >
              Your browser does not support iframes.
            </StyledIFrame>
          )}
        </Flex>
      </Content>
    </Layout>
  )
}

export default MoonPayWidget
