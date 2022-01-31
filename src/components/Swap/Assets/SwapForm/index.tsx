import Big from 'big.js'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Box, Button, Flex, Loader, Text } from 'rimble-ui'
import { useTranslation } from 'react-i18next'
import Grid from 'src/components/common/Grid'
import Label from 'src/components/common/Form/Label'
import { ExtendedPoolToken } from 'src/shared/types/tokens'
import { ReactComponent as DownIcon } from 'src/assets/icons/DownIcon.svg'
import TokenSelector from 'src/components/common/TokenSelector'
import MaxInput from 'src/components/common/MaxInput'
import { prettifyBalance } from 'src/shared/utils'
import { BPoolProxy } from 'src/contracts/BPoolProxy'
import useAsyncState from 'src/hooks/useAsyncState'
import { useSnackbar } from 'src/components/common/Snackbar'
import { big, denormalize, normalize, ZERO } from 'src/shared/utils/big-helpers'
import { useIsProxyDeployed } from 'src/shared/observables/proxyDeployed'
import useTransactionAlerts from 'src/hooks/useTransactionAlerts'
import SmartButton from 'src/components/common/Buttons/SmartButton'
import { calcProtocolFee } from 'src/shared/utils/pool-calc'
import config from 'src/environment'
import blotout from 'src/services/blotout'
import useAsyncMemo from 'src/hooks/useAsyncMemo'
import { TRANSACTION_RELOAD_DELAY } from 'src/shared/consts/time'
import { useQueryParam } from 'use-query-params'
import { SmtPriceFeed } from 'src/contracts/SmtPriceFeed'
import autoRound from 'src/shared/utils/math/autoRound'
import autoRoundWithFallback from 'src/shared/utils/math/autoRoundWithFallback'
import TextWithTooltip from 'src/components/common/Text/TextWithTooltip'
import { Tier } from 'src/shared/enums'
import { propEquals } from 'src/shared/utils/collection/filters'
import wait from 'src/shared/utils/wait'
import { allowanceLoading, isUnlocked } from 'src/shared/utils/tokens/allowance'
import { useAccount } from 'src/shared/web3'
import { useCpk } from 'src/cpk'
import { useTier } from 'src/state/hooks'
import DiscountSwitch from './DiscountSwitch'
import useSwapValues from './useSwapValues'
import { FlipButton } from '../styled-components'
import ProxyContractModal from '../ProxyContractModal'
import useBestPool from './useBestPool'
import { SwapContext } from '../../SwapContext'
import useSwapTokens from './useSwapTokens'

const { faq: faqLink } = config.resources.docs.gettingStarted

const SwapForm = () => {
  const { t } = useTranslation(['swap', 'errors'])
  const { addError } = useSnackbar()
  const { track } = useTransactionAlerts()
  const account = useAccount()
  const cpk = useCpk()
  const tier = useTier()
  const isProxyDeployed = useIsProxyDeployed()
  const [initiated, setInitiated] = useState(false)
  const [isProxyModalOpen, setIsProxyModalOpen] = useState(false)

  const [tokenInAddress] = useQueryParam<string>('tokenIn')
  const [tokenOutAddress] = useQueryParam<string>('tokenOut')
  const [amountOutValue] = useQueryParam<string>('amountOut')
  const { tokenIn, tokenOut, settings, setTokenPair, swaps } = useContext(
    SwapContext,
  )

  const [isDiscountEnabled, setIsDiscountEnabled] = useState(
    settings.autoPaySmtDiscount,
  )

  const [bestPool, { loading: poolLoading }] = useBestPool(
    tokenIn?.xToken,
    tokenOut?.xToken,
  )

  const {
    amountIn,
    amountOut,
    maxAmountIn,
    lastPrice,
    valid,
    error: validationError,
    setAmountIn,
    setAmountOut,
  } = useSwapValues(tokenIn, tokenOut, bestPool)

  const [protocolFee] = useAsyncMemo(
    async () => {
      const denormProtocolFee = await calcProtocolFee(
        tokenIn,
        amountIn,
        bestPool?.swapFee || 0,
      )

      return normalize(denormProtocolFee, tokenIn?.decimals)
    },
    ZERO,
    [bestPool?.swapFee, tokenIn, amountIn],
  )

  const price = useMemo(() => (amountIn ? amountOut / amountIn : undefined), [
    amountIn,
    amountOut,
  ])

  const [isPriceReverted, setIsPriceReverted] = useState(false)
  const [txLoading, setTxLoading] = useAsyncState(false)

  const {
    fullTokens,
    reloadTokens,
    loading: tokensLoading,
    balancesLoading,
  } = useSwapTokens()

  const [utilityTokenAddress] = useAsyncMemo(
    () => BPoolProxy.getUtilityTokenAddress(),
    null,
    [],
  )

  const utilityToken = useMemo(
    () => fullTokens.find(propEquals('id', utilityTokenAddress)),
    [fullTokens, utilityTokenAddress],
  )

  const [smtFeeAmount] = useAsyncMemo(
    async () => {
      if (tokenIn?.xToken?.id && protocolFee.gt(0)) {
        return SmtPriceFeed.calculateAmount(
          tokenIn.xToken.id,
          denormalize(protocolFee.div(2), tokenIn.decimals),
        )
      }
      return ZERO
    },
    ZERO,
    [tokenIn?.xToken?.id, protocolFee],
  )

  useEffect(() => {
    if (!tokensLoading) {
      const newTokenIn =
        fullTokens.find(propEquals('id', tokenInAddress || tokenIn?.id)) ||
        fullTokens[0]
      const newTokenOut = fullTokens.find(
        propEquals('id', tokenOutAddress || tokenOut?.id),
      )

      setTokenPair({
        tokenIn: newTokenIn,
        ...(newTokenOut && { tokenOut: newTokenOut }),
      })
      setInitiated(true)
    }
  }, [
    fullTokens,
    setTokenPair,
    tokenInAddress,
    tokenOutAddress,
    tokenIn?.id,
    tokenOut?.id,
    tokensLoading,
    initiated,
  ])

  const handleAmountInChange = useCallback(
    (value: number) => {
      if (!Number.isNaN(value)) {
        setAmountIn(Number(value))
      }
    },
    [setAmountIn],
  )

  const handleAmountOutChange = useCallback(
    (value: number) => {
      if (!Number.isNaN(value)) {
        setAmountOut(Number(value))
      }
    },
    [setAmountOut],
  )

  useEffect(() => {
    if (amountOutValue) handleAmountOutChange(Number(amountOutValue))
  }, [amountOutValue, handleAmountOutChange])

  const handleTokenInSelection = useCallback(
    (token: ExtendedPoolToken) => {
      if (tokenOut?.id === token.id) {
        setTokenPair({ tokenIn: token, tokenOut: tokenIn })
        setAmountIn(amountOut)
      } else {
        setTokenPair({ tokenIn: token })
      }
    },
    [tokenOut?.id, setTokenPair, tokenIn, setAmountIn, amountOut],
  )

  const handleTokenOutSelection = (token: ExtendedPoolToken) =>
    setTokenPair({ tokenOut: token })

  const handleFlipClick = useCallback(() => {
    setTokenPair({ tokenIn: tokenOut, tokenOut: tokenIn })
    setAmountIn(amountOut)
  }, [setTokenPair, tokenOut, tokenIn, setAmountIn, amountOut])

  const handleFlipPrice = () => setIsPriceReverted((prevState) => !prevState)

  const handleSwap = useCallback(async () => {
    if (!account) {
      return
    }
    setTxLoading(true)
    try {
      if (!tokenIn || !tokenOut) return

      if (!isProxyDeployed && !isProxyModalOpen) {
        setIsProxyModalOpen(true)
        return
      }

      const tx = await BPoolProxy.swapExactIn(
        account,
        tokenIn,
        tokenOut,
        big(amountIn),
        big(amountOut).times(1 - settings.tolerance / 100),
        isDiscountEnabled ? smtFeeAmount : protocolFee,
        isDiscountEnabled ? utilityToken : undefined,
      )

      track(tx)

      blotout.captureSwap(
        tokenIn.address,
        tokenOut.address,
        amountIn,
        amountOut,
      )

      await tx?.transactionResponse?.wait()
      setTimeout(() => {
        reloadTokens()
        swaps.refetch()
      }, TRANSACTION_RELOAD_DELAY)
    } catch (e) {
      addError(e as Error, {
        description: t('errors:transactionGeneric'),
        actionText: 'faqs',
        actionHref: faqLink,
      })
    } finally {
      setTxLoading(false)
    }
  }, [
    account,
    addError,
    amountIn,
    amountOut,
    isProxyDeployed,
    isProxyModalOpen,
    protocolFee,
    reloadTokens,
    setTxLoading,
    settings.tolerance,
    swaps,
    t,
    tokenIn,
    tokenOut,
    track,
    isDiscountEnabled,
    smtFeeAmount,
    utilityToken,
  ])

  const onCloseProxyModal = async (action: 'resolve' | 'reject') => {
    setIsProxyModalOpen(false)
    if (action === 'resolve') await handleSwap()
  }

  const handleTokenUnlock = useCallback(
    async (token: ExtendedPoolToken) => {
      setTxLoading(true)
      try {
        const tx = await token?.contract?.enableToken(cpk?.address || '')

        await track(tx, {
          skipSubmit: true,
          confirm: { message: `${token?.name} is unlocked` },
        })

        await wait(2000)
      } catch (e) {
        addError(e as Error)
      } finally {
        setTxLoading(false)
      }
    },
    [cpk?.address, setTxLoading, track, addError],
  )

  const isTokenInAllowanceLoading =
    tokenIn && allowanceLoading(tokenIn, account)
  const isUtilityAllowanceLoading =
    utilityToken && allowanceLoading(utilityToken, account)
  const isTokenInUnlocked = tokenIn && isUnlocked(tokenIn, amountIn)
  const isUtilityTokenUnlocked =
    utilityToken && isUnlocked(utilityToken, smtFeeAmount)

  const handleSwapButtonClick = useMemo(() => {
    if (tokenIn && !isTokenInAllowanceLoading && !isTokenInUnlocked) {
      return handleTokenUnlock.bind(null, tokenIn)
    }

    if (
      isDiscountEnabled &&
      utilityToken &&
      !isUtilityAllowanceLoading &&
      !isUtilityTokenUnlocked
    ) {
      return handleTokenUnlock.bind(null, utilityToken)
    }

    return handleSwap
  }, [
    tokenIn,
    isTokenInAllowanceLoading,
    isDiscountEnabled,
    isUtilityAllowanceLoading,
    isTokenInUnlocked,
    isUtilityTokenUnlocked,
    handleSwap,
    handleTokenUnlock,
    utilityToken,
  ])

  const loading = useMemo(
    () =>
      !initiated ||
      txLoading ||
      tokensLoading ||
      balancesLoading ||
      poolLoading ||
      isTokenInAllowanceLoading ||
      (isDiscountEnabled && isUtilityAllowanceLoading),
    [
      initiated,
      txLoading,
      tokensLoading,
      balancesLoading,
      poolLoading,
      isTokenInAllowanceLoading,
      isDiscountEnabled,
      isUtilityAllowanceLoading,
    ],
  )

  const disabled =
    !account ||
    loading ||
    (isTokenInUnlocked && (!valid || !bestPool)) ||
    tier === Tier.tier0

  const tokenSymbols = useMemo(() => {
    const symbolsArray = [tokenIn?.symbol, tokenOut?.symbol]
    return isPriceReverted ? symbolsArray.reverse() : symbolsArray
  }, [tokenIn?.symbol, tokenOut?.symbol, isPriceReverted])

  return (
    <>
      <Grid gridTemplateColumns="2fr 150px" gridGap={[2, 3]}>
        <Flex width="100%" flexDirection="column" justifyContent="flex-end">
          <Label mobile>{t('assets.from')}</Label>
          <Box position="relative">
            <MaxInput
              onChange={handleAmountInChange}
              value={amountIn}
              max={maxAmountIn}
              height="48px"
              px="16px"
              doNotValidate
            />
          </Box>
        </Flex>
        <Flex width="100%" flexDirection="column" justifyContent="flex-end">
          <TokenSelector
            onChange={handleTokenInSelection}
            selected={tokenIn}
            tokens={fullTokens}
            loading={!initiated}
          />
        </Flex>
      </Grid>

      <Flex my={3} justifyContent="center" width="100%">
        <FlipButton onlyIcon onClick={handleFlipClick}>
          <DownIcon />
        </FlipButton>
      </Flex>

      <Grid gridTemplateColumns="2fr 150px" gridGap={[2, 3]}>
        <Flex width="100%" flexDirection="column" justifyContent="flex-end">
          <Label mobile>{t('assets.to')}</Label>
          <MaxInput
            onChange={handleAmountOutChange}
            value={amountOut}
            disabled={!tokenOut}
            height="48px"
            px="16px"
            doNotValidate
            showMax={false}
          />
        </Flex>
        <Flex width="100%" flexDirection="column" justifyContent="flex-end">
          <TokenSelector
            onChange={handleTokenOutSelection}
            selected={tokenOut}
            filter={(token) => token.address !== tokenIn?.address}
            tokens={fullTokens}
            loading={!initiated}
            emptyValue={
              <Text.span color="grey">{t('assets.selectToken')}</Text.span>
            }
          />
        </Flex>
      </Grid>

      <Text
        fontSize={1}
        color="grey"
        textAlign="center"
        mt="20px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        opacity={tokenOut && tokenIn ? '1' : '0'}
      >
        {price
          ? t('assets.exchangeRate', {
              tokenIn: tokenSymbols[0],
              rate: prettifyBalance(isPriceReverted ? 1 / price : price, 6),
              tokenOut: tokenSymbols[1],
            })
          : '--'}
        <Button.Text
          onlyIcon
          icon="SwapHoriz"
          height="auto"
          onClick={handleFlipPrice}
        />
      </Text>
      <Box>
        <SmartButton
          type="button"
          disabled={disabled}
          width="100%"
          height={['40px', '52px']}
          fontWeight={4}
          fontSize={[2, 3]}
          mt="24px"
          mainColor={loading ? 'grey' : 'primary'}
          onClick={handleSwapButtonClick}
          loadingText={
            <>
              <Loader mr={2} color="white" />
              {t('assets.loading')}
            </>
          }
        >
          {(loading && (
            <>
              <Loader mr={2} color="white" />
              {t('assets.loading')}
            </>
          )) ||
            (!account && t('assets.swapButton')) ||
            (!isTokenInUnlocked &&
              t('assets.unlockToken', { tokenName: tokenIn?.symbol })) ||
            (isDiscountEnabled &&
              !isUtilityTokenUnlocked &&
              t('assets.unlockToken', { tokenName: utilityToken?.symbol })) ||
            validationError ||
            t('assets.swapButton')}
        </SmartButton>
      </Box>

      <Flex mt={3} flexDirection="column" color="grey">
        <TextWithTooltip
          tooltip={t('assets.transactionFeeTooltip', {
            swapFee: prettifyBalance(
              autoRound(big(amountIn).times(bestPool?.swapFee || 0), {
                maxDecimals: 18,
              }),
            ),
            protocolFee: prettifyBalance(
              autoRound(isDiscountEnabled ? smtFeeAmount : protocolFee, {
                maxDecimals: 18,
              }),
            ),
            swapFeeToken: tokenIn?.symbol,
            protocolFeeToken: (isDiscountEnabled ? utilityToken : tokenIn)
              ?.symbol,
          })}
        >
          <Text.span fontSize={1}>
            {t('assets.transactionFee')}{' '}
            <Text.span color="black" fontSize={1}>
              {autoRoundWithFallback(
                big(amountIn)
                  .times(bestPool?.swapFee || 0)
                  .add(isDiscountEnabled ? 0 : protocolFee),
                { maxDecimals: 4, minValue: 0.0001 },
              )}
              &nbsp;
              {tokenIn?.symbol || '--'}
              {isDiscountEnabled &&
                ` + ${autoRoundWithFallback(smtFeeAmount, {
                  maxDecimals: 5,
                  minValue: 0.00001,
                })} ${utilityToken?.symbol || '--'}`}
            </Text.span>
          </Text.span>
        </TextWithTooltip>

        <Flex mt={3} justifyContent="space-between">
          <TextWithTooltip tooltip={t('assets.priceImpactTooltip')}>
            <Text.span fontSize={1}>
              {t('assets.priceImpact')}{' '}
              <Text.span fontSize={1} color="success">
                {`<${
                  price && lastPrice
                    ? new Big((lastPrice - price) / lastPrice)
                        .times(100)
                        .round(2, 3)
                        .abs()
                        .toNumber()
                    : 0
                }%`}
              </Text.span>
            </Text.span>
          </TextWithTooltip>

          <Flex>
            <TextWithTooltip tooltip={t('assets.discountFeeTooltip')}>
              <Text.span fontSize={1}>{t('assets.discountFee')}</Text.span>
            </TextWithTooltip>
            &nbsp;
            <DiscountSwitch
              checked={isDiscountEnabled}
              setChecked={setIsDiscountEnabled}
              feeAmount={smtFeeAmount}
              utilityToken={utilityToken}
            />
          </Flex>
        </Flex>
      </Flex>

      <ProxyContractModal
        isOpen={isProxyModalOpen}
        onResolve={() => onCloseProxyModal('resolve')}
        onReject={() => onCloseProxyModal('reject')}
      />
    </>
  )
}

export default SwapForm
