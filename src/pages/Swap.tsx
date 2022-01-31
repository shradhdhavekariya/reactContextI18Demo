import { useCallback, useMemo, useState } from 'react'
import { Box, Flex } from 'rimble-ui'
import { useTranslation } from 'react-i18next'
import Layout from 'src/components/common/Layout'
import Content from 'src/components/common/Content'
import Assets from 'src/components/Swap/Assets'
import AdvancedSettings from 'src/components/Swap/AdvancedSettings'
import TokenPairSwaps from 'src/components/Swap/TokenPairSwaps'
// import TokenComparator from 'src/components/Swap/TokenComparator'
import { SwapPair, SwapTxSettings } from 'src/shared/types'
import HeaderActions from 'src/components/common/HeaderActions'
import AlertPanel from 'src/components/common/AlertPanel'
import { SwapContext } from 'src/components/Swap/SwapContext'
import { ExtendedPoolToken } from 'src/shared/types/tokens'
import useDeepMemo from 'src/hooks/useDeepMemo'
import PriceChart from 'src/components/Swap/PriceChart'
import { useQueryParam } from 'use-query-params'
import { startOfDay, subDays } from 'date-fns'
import { useSwaps } from 'src/shared/hooks'
import { getStoredSettings } from 'src/shared/utils'
import TransactionForbidden from 'src/components/FlashToasts/TransactionForbidden'
import { useAccount } from 'src/shared/web3'

const DEFAULT_DATE_FROM = startOfDay(subDays(new Date(), 14))

const Swap = () => {
  const { t } = useTranslation('swap')
  const account = useAccount()

  const [settingsOpened, setSettingsOpened] = useState(false)
  const [isHistoryOpened, setIsHistoryOpened] = useState(false)
  const toggleAdvancedSettings = useCallback(
    () => setSettingsOpened((prev) => !prev),
    [],
  )
  const [settings, setSwapSettings] = useState<SwapTxSettings>(() =>
    getStoredSettings(),
  )

  const [{ tokenIn, tokenOut }, setTokens] = useState<
    SwapPair<ExtendedPoolToken>
  >({})

  const [, setTokenInAddress] = useQueryParam<string>('tokenIn')
  const [, setTokenOutAddress] = useQueryParam<string>('tokenOut')

  const xTokenPair: [string, string] | undefined = useDeepMemo(() => {
    if (tokenIn?.xToken?.id && tokenOut?.xToken?.id) {
      return [tokenIn.xToken.id, tokenOut.xToken.id].sort() as [string, string]
    }

    return undefined
  }, [tokenIn?.xToken?.id, tokenOut?.xToken?.id])

  const setTokenPair = useCallback(
    (pair: SwapPair<ExtendedPoolToken>) => {
      if (pair.tokenIn) {
        setTokens((prevPair) => ({
          tokenIn: pair.tokenIn,
          tokenOut: prevPair.tokenOut,
        }))
        setTokenInAddress(pair.tokenIn.id)
      }

      if (pair.tokenOut) {
        setTokens((prevPair) => ({
          tokenIn: prevPair.tokenIn,
          tokenOut: pair.tokenOut,
        }))
        setTokenOutAddress(pair.tokenOut.id)
      }
    },
    [setTokenInAddress, setTokenOutAddress],
  )

  const swaps = useSwaps(
    useMemo(
      () => ({
        tokenPair: xTokenPair,
        userAddress: account,
        dateFrom: DEFAULT_DATE_FROM,
        limit: 3,
        ignore: !account,
      }),
      [account, xTokenPair],
    ),
  )

  const closeSettingsModal = () => setSettingsOpened(false)

  const toggleHistory = () => setIsHistoryOpened((prev) => !prev)

  return (
    <SwapContext.Provider
      value={{
        tokenIn,
        tokenOut,
        setTokenPair,
        settings,
        setSwapSettings,
        swaps,
      }}
    >
      <TransactionForbidden />
      <Layout
        header={t('header')}
        headerActions={<HeaderActions wallet passport addLiquidity />}
      >
        <Content bg="background">
          <Flex flexDirection="column" m="0 auto" width="520px">
            <AlertPanel />

            <Assets
              toggleAdvancedSettings={toggleAdvancedSettings}
              advancedSettingsOpen={settingsOpened}
              isHistoryOpened={isHistoryOpened}
              toggleHistoryVisibility={toggleHistory}
            />

            <Box>
              {isHistoryOpened && <PriceChart tokenPair={xTokenPair} />}
              {isHistoryOpened && <TokenPairSwaps tokenPair={xTokenPair} />}
            </Box>
          </Flex>
          <AdvancedSettings
            isOpen={settingsOpened}
            onClose={closeSettingsModal}
          />
        </Content>
      </Layout>
    </SwapContext.Provider>
  )
}

export default Swap
