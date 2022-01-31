import { useCallback, useContext } from 'react'
import { Flex, Text, Tooltip, Box } from 'rimble-ui'
import { useTranslation } from 'react-i18next'
import { MarginProps } from 'styled-system'
import StyledTable from 'src/components/common/StyledTable'
import { useReadyState, useAccount } from 'src/shared/web3'
import { prettifyBalance } from 'src/shared/utils'
import TokenIcon from 'src/components/common/TokenIcon'
import { createCpk } from 'src/cpk'
import { AlertVariant } from 'src/components/common/Snackbar/types'
import { useSnackbar } from 'src/components/common/Snackbar'
import SmartButton from 'src/components/common/Buttons/SmartButton'
import useTransactionAlerts from 'src/hooks/useTransactionAlerts'
import useUserAccount from 'src/shared/hooks/useUserAccount'
import config from 'src/environment'
import { useIsProxyDeployed } from 'src/shared/observables/proxyDeployed'
import equals from 'src/shared/utils/string/equals'
import { WalletContext } from '../WalletContext'
import ProxyTokensHead from './ProxyTokensHead'
import useProxyAddressTokens from './useProxyAddressTokens'
import WalletSection from '../WalletSection'
import AssetRow from '../AssetRow'
import InfoRow from '../InfoRow'
import InfoLink from '../InfoLink'

const {
  gettingStarted: { proxyTokensExplanation },
} = config.resources.docs

const ProxyTokens = (props: MarginProps) => {
  const { selectedAccount } = useContext(WalletContext)
  const { t } = useTranslation('wallet')
  const { addAlert, addError } = useSnackbar()
  const { track } = useTransactionAlerts()
  const account = useAccount()
  const ready = useReadyState()
  const userAccount = useUserAccount(selectedAccount)
  const isProxyDeployed = useIsProxyDeployed()
  const { tokens, loading } = useProxyAddressTokens(userAccount?.cpkAddress)

  const proxyUsdBalance = tokens.reduce(
    (acc, token) => acc + token.cpkXTokenUsdBalance,
    0,
  )

  const handleClaimAllClick = useCallback(async () => {
    if (!equals(account, selectedAccount)) {
      addAlert(t('proxyTokens.connectAccount'), {
        variant: AlertVariant.default,
      })

      return
    }

    const cpk = await createCpk()

    if (account && cpk) {
      try {
        const tx = await cpk.claimAll(account, tokens)

        await track(tx, {
          confirm: {
            message: t('proxyTokens.claimAllSuccess'),
          },
        })
      } catch (e) {
        addError(e as Error)
      }
    }
  }, [account, selectedAccount, addAlert, t, tokens, track, addError])

  const dataLoading = !ready || loading
  const noResults = !dataLoading && !tokens.length

  if (!isProxyDeployed || !equals(account, selectedAccount)) return <></>

  return (
    <WalletSection title={t('proxyTokens.header')} {...props}>
      <Box mt={[3, '24px']}>
        <StyledTable>
          <ProxyTokensHead />
          <tbody>
            <InfoRow show={noResults} loading={dataLoading}>
              {t('proxyTokens.noResults')}{' '}
              <InfoLink href={proxyTokensExplanation} title="Learn more">
                Learn more
              </InfoLink>
            </InfoRow>

            {!!tokens.length && (
              <AssetRow>
                <td>
                  <Flex
                    alignItems="flex-start"
                    flexDirection={['column', 'row']}
                    ml={2}
                  >
                    <Flex
                      alignItems="flex-start"
                      justifyContent="center"
                      display={['flex', 'none']}
                    >
                      <Text fontSize={1} fontWeight={4} color="grey">
                        {t('proxyTokens.assets')}
                      </Text>
                    </Flex>
                    <Flex mt={[1, 0]} flexWrap="wrap">
                      {tokens.slice(0, 2).map(({ symbol, name, id }, index) => (
                        <Flex alignItems="center" key={id} mr={2}>
                          <TokenIcon
                            symbol={symbol}
                            name={name}
                            width="32px"
                            height="32px"
                          />
                          <Text.span fontSize={2} fontWeight={5} ml="10px">
                            {symbol}
                            {tokens.length > index + 1 && ', '}
                          </Text.span>
                        </Flex>
                      ))}
                      {tokens.length > 2 && (
                        <Flex alignItems="center">
                          <Tooltip
                            placement="top"
                            message={tokens
                              .slice(2)
                              .map(({ symbol }) => symbol)
                              .join(', ')}
                          >
                            <Text fontSize={2} fontWeight={5}>
                              {t('proxyTokens.andOthersWithCount', {
                                count: tokens.length - 2,
                              })}
                            </Text>
                          </Tooltip>
                        </Flex>
                      )}
                    </Flex>
                  </Flex>
                </td>
                <td>
                  <Flex
                    alignItems={['flex-start', 'flex-end']}
                    flexDirection="column"
                  >
                    <Flex
                      alignItems="flex-start"
                      justifyContent="center"
                      display={['flex', 'none']}
                    >
                      <Text fontSize={1} fontWeight={4} color="grey">
                        {t('proxyTokens.balance')}
                      </Text>
                    </Flex>
                    <Flex
                      justifyContent={['flex-start', 'flex-end']}
                      mt={[1, 0]}
                    >
                      {prettifyBalance(proxyUsdBalance)} USD
                    </Flex>
                  </Flex>
                </td>
                <td>
                  <Flex
                    justifyContent={['flex-start', 'flex-end']}
                    alignItems="center"
                  >
                    {!!tokens.length && (
                      <>
                        <SmartButton
                          height="28px"
                          px={2}
                          onClick={handleClaimAllClick}
                        >
                          {t('proxyTokens.claimAll')}
                        </SmartButton>
                        <InfoLink
                          ml={2}
                          href={proxyTokensExplanation}
                          title="Learn more"
                        >
                          Learn more
                        </InfoLink>
                      </>
                    )}
                  </Flex>
                </td>
              </AssetRow>
            )}
          </tbody>
        </StyledTable>
      </Box>
    </WalletSection>
  )
}

export default ProxyTokens
