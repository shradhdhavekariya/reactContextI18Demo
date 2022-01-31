import {
  SyntheticEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Flex, Text, Tooltip, Box } from 'rimble-ui'
import { ExpandMore } from '@rimble/icons'
import StyledTable from 'src/components/common/StyledTable'
import { useTranslation } from 'react-i18next'
import { MarginProps } from 'styled-system'
import { AssetToken, NativeToken } from 'src/shared/types/tokens'
import { useAssetTokens, usePoolTokens } from 'src/shared/hooks'
import { useReadyState, useAccount, useNetwork } from 'src/shared/web3'
import { useCpk } from 'src/cpk'
import { prettifyBalance, recursiveRound } from 'src/shared/utils'
import { AllowanceStatus } from 'src/shared/enums'
import useArrayInjector from 'src/shared/hooks/useArrayInjector'
import balanceOf$ from 'src/shared/observables/balanceOf'
import contractOf$ from 'src/shared/observables/contractOf'
import equals from 'src/shared/utils/string/equals'
import exchangeRateOf$ from 'src/shared/observables/exchangeRateOf'
import { VSMT_TOKEN } from 'src/shared/consts'
import useUserAccount from 'src/shared/hooks/useUserAccount'
import userBalances$ from 'src/shared/observables/userBalances'
import config from 'src/environment'
import { propEquals } from 'src/shared/utils/collection/filters'
import allowanceOf$, {
  allowanceStatusOf$,
} from 'src/shared/observables/allowanceOf'
import { balancesLoading } from 'src/shared/utils/tokens/balance'
import { WalletContext } from '../WalletContext'
import AssetTokenRow from './AssetTokensRow'
import AssetTokensHead from './AssetTokensHead'
import WalletSection from '../WalletSection'
import InfoRow from '../InfoRow'
import InfoLink from '../InfoLink'

const { getCrypto: getCryptoLink } = config.resources.docs.gettingStarted

const AssetTokens = (props: MarginProps) => {
  const {
    selectedAccount,
    userUsdBalance,
    setNativeTokensBalance,
  } = useContext(WalletContext)
  const { t } = useTranslation('wallet')
  const account = useAccount()
  const cpk = useCpk()
  const ready = useReadyState()
  const userAccount = useUserAccount(selectedAccount)
  const { networkName } = useNetwork()

  const {
    allTokens: allNativeTokens,
    loading: queryLoading,
    error,
  } = useAssetTokens()

  const { allTokens: allPoolTokens, loading: poolLoading } = usePoolTokens({
    cpkAddress: userAccount?.cpkAddress,
  })

  const [amountToDisplay, setAmountToDisplay] = useState<number>(3)
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1)

  const addMethodsToToken = useCallback(
    (token) => ({
      ...token,
      enable: async () =>
        cpk?.address && token.contract?.enableToken(cpk.address),
      disable: async () =>
        cpk?.address && token.contract?.disableToken(cpk.address),
    }),
    [cpk?.address],
  )

  const fullTokens = useArrayInjector<AssetToken>(
    useMemo(
      () => ({
        exchangeRate: exchangeRateOf$(0),
        balance: balanceOf$(userAccount?.address),
        userBalances: userBalances$(userAccount?.address),
        contract: contractOf$(),
        allowance: allowanceOf$(userAccount?.address, userAccount?.cpkAddress),
        allowanceStatus: allowanceStatusOf$(
          userAccount?.address,
          userAccount?.cpkAddress,
        ),
      }),
      [userAccount?.address, userAccount?.cpkAddress],
    ),
    useMemo(
      () =>
        [...allNativeTokens, VSMT_TOKEN as NativeToken].map((token) => ({
          ...token,
          exchangeRate: 0,
          allowanceStatus: AllowanceStatus.NOT_AVAILABLE,
          userBalances: { native: 0, usd: 0 },
        })),
      [allNativeTokens],
    ),
  )

  const areBalancesLoading = balancesLoading(fullTokens, account)

  const positivePoolTokens = useMemo(
    () => allPoolTokens.filter(({ userBalances }) => userBalances.ether),
    [allPoolTokens],
  )

  const positiveTokens = useMemo(
    () =>
      fullTokens
        ?.filter(
          ({ balance, xToken }) =>
            !!balance ||
            (xToken &&
              positivePoolTokens.find((x) =>
                x.tokens.find(propEquals('symbol', xToken.symbol)),
              )),
        )
        .map(addMethodsToToken),
    [addMethodsToToken, fullTokens, positivePoolTokens],
  )

  useEffect(() => {
    const rawTotal = positiveTokens.reduce(
      (total, { userBalances }) => total + userBalances.usd,
      0,
    )
    setNativeTokensBalance(recursiveRound<number>(rawTotal))
  }, [positiveTokens, setNativeTokensBalance])

  const onLoadMore = (event: SyntheticEvent) => {
    event.stopPropagation()
    setAmountToDisplay((displayed) => displayed + 3)
  }

  const disconnected = !account
  const loading = queryLoading || !ready || areBalancesLoading || poolLoading
  const hasError = !!error
  const noResults = !hasError && !positiveTokens.length

  return (
    <WalletSection
      title={t('assetTokens.header', { network: networkName })}
      badge={
        <Text
          fontWeight={5}
          color="grey"
          fontSize={2}
          display={['block', 'none']}
        >
          {prettifyBalance(userUsdBalance.nativeTokens)} USD
        </Text>
      }
      {...props}
    >
      <Box mt={[3, '24px']}>
        <StyledTable>
          <AssetTokensHead />
          <tbody>
            <InfoRow
              show={!loading && noResults}
              loading={loading && noResults}
              error={
                (disconnected && t('queryStatuses.noAccount')) ||
                (hasError && t('queryStatuses.error'))
              }
            >
              {t('queryStatuses.noResults')}
              <InfoLink
                href={getCryptoLink}
                title={t('queryStatuses.getCrypto')}
              >
                {t('queryStatuses.getCrypto')}
              </InfoLink>
            </InfoRow>
            {positiveTokens
              .slice(0, amountToDisplay)
              .map(({ decimals, balance, ...token }, index) => (
                <AssetTokenRow
                  key={token.id}
                  rowIndex={index}
                  tokenToRender={token}
                  hoveredIndex={hoveredIndex}
                  disableActions={!equals(account, selectedAccount)}
                  selectedAccount={userAccount}
                  setHoveredIndex={setHoveredIndex}
                />
              ))}
          </tbody>
        </StyledTable>
        {positiveTokens.length > amountToDisplay && (
          <Flex alignItems="center" justifyContent="center" mt={3}>
            <Tooltip placement="top" message="Load more">
              <ExpandMore
                onClick={onLoadMore}
                cursor="pointer"
                color="near-black"
              />
            </Tooltip>
          </Flex>
        )}
      </Box>
    </WalletSection>
  )
}

export default AssetTokens
