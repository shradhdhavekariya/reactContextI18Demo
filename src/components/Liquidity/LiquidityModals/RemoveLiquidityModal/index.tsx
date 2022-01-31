import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Text, Loader, Flex, Button } from 'rimble-ui'
import { prettifyBalance } from 'src/shared/utils'
import { ExtendedPoolToken, PoolToken } from 'src/shared/types/tokens'
import Dialog from 'src/components/common/Dialog'
import { big, min, normalize } from 'src/shared/utils/big-helpers'
import {
  calcAmountInByPoolAmountOut,
  calcMaxPoolInBySingleOut,
} from 'src/shared/utils/pool-calc'
import { LiquidityModalProps } from 'src/shared/types/props'
import H4 from 'src/components/Liquidity/H4'
import PoolOverview from 'src/components/Liquidity/PoolOverview'
import RemoveSingleAssetRow from './RemoveSingleAssetRow'
import RemoveMultipleAssetsRow from './RemoveMultipleAssetsRow'
import RemoveLiquidityButton from './RemoveLiquidityButton'
import LiquidityAssetList from '../LiquidityAssetList'

const RemoveLiquidityModal = ({
  pool,
  isOpen = false,
  onClose,
  reload,
  loading = false,
}: LiquidityModalProps) => {
  const { t } = useTranslation(['liquidityModals', 'navigation'])
  const [selectedOption, setSelectedOption] = useState<PoolToken | 'all'>('all')
  const [liquidityToRemove, setLiquidityToRemove] = useState(0)
  const [transactionLoading, setTransactionLoading] = useState(false)

  const handleOnSelection = (token: PoolToken | 'all') => {
    setLiquidityToRemove(0)
    setSelectedOption(token)
  }

  const totalShares = Number(pool?.totalShares || 0)

  const userPoolTokenBalance = useMemo(() => big(pool?.cpkBalance || 0), [
    pool?.cpkBalance,
  ])

  const userPoolShareRatio = totalShares
    ? userPoolTokenBalance.div(totalShares).toNumber()
    : 0

  const multiple = selectedOption === 'all'

  const maxTokensToRedeem = useMemo(
    () =>
      multiple
        ? userPoolTokenBalance
        : min(
            calcMaxPoolInBySingleOut(pool, selectedOption as ExtendedPoolToken),
            userPoolTokenBalance,
          ),
    [multiple, pool, selectedOption, userPoolTokenBalance],
  )

  const poolTokensToRedeem = maxTokensToRedeem.times(liquidityToRemove / 100)

  const handleReload = () => {
    reload?.()
    setLiquidityToRemove(0)
    onClose?.()
  }

  const newSptBalance = userPoolTokenBalance.minus(poolTokensToRedeem)

  const poolOverviewProps = {
    poolTokensToIssue: poolTokensToRedeem,
    userPoolTokenBalance,
    tokens: pool.tokens,
    id: pool.id || '',
    swapFee: pool.swapFee,
    totalShares: pool.totalShares || '0',
  }

  return (
    <Dialog
      isOpen={isOpen}
      width={['100%', 'auto']}
      minWidth={[0, 0, '800px']}
      onClose={onClose}
      title={t('remove.header')}
      p="24px"
    >
      <Flex overflow="hidden" display="flex" flexDirection="row">
        <PoolOverview {...poolOverviewProps} action="remove" />
        <Flex pl="24px" flex="1 1 auto" flexDirection="column">
          <H4
            text={t(
              userPoolTokenBalance.toNumber()
                ? 'remove.selectAssetsToRemove'
                : 'remove.noAssetsToRemove',
            )}
          />
          {!pool.tokens.length ? (
            <Flex justifyContent="center" alignItems="center" height="100%">
              <Loader size="48px" />
            </Flex>
          ) : (
            <>
              {!!userPoolShareRatio && (
                <RemoveMultipleAssetsRow
                  onSelect={() => handleOnSelection('all')}
                  value={liquidityToRemove}
                  checked={selectedOption === 'all'}
                  onChange={setLiquidityToRemove}
                  disabled={transactionLoading}
                />
              )}
              <LiquidityAssetList>
                {pool.tokens.map((token) => (
                  <RemoveSingleAssetRow
                    key={token.address}
                    token={token}
                    sptToRemove={liquidityToRemove}
                    checked={
                      selectedOption !== 'all' &&
                      selectedOption?.address === token.address
                    }
                    onSelect={() => handleOnSelection(token)}
                    onChange={setLiquidityToRemove}
                    multiple={multiple}
                    value={normalize(
                      calcAmountInByPoolAmountOut(
                        pool,
                        userPoolTokenBalance,
                        token,
                        multiple,
                        0,
                      ),
                      token.decimals,
                    ).toNumber()}
                    // DISABLED TEMPORARILY
                    disabled={true || transactionLoading || !userPoolShareRatio}
                  />
                ))}
              </LiquidityAssetList>
            </>
          )}
          <Box width="100%" px={2} mb="24px">
            <Flex justifyContent="space-between" height="24px">
              <Text.span>SPT amount:</Text.span>
              <Text.span
                color={poolTokensToRedeem.eq(0) ? 'grey' : 'danger'}
                fontWeight={5}
              >
                {poolTokensToRedeem.eq(0)
                  ? 0
                  : `- ${prettifyBalance(poolTokensToRedeem)}`}{' '}
                SPT
              </Text.span>
            </Flex>
            <Flex justifyContent="space-between">
              <Text.span color="grey">Your new SPT balance:</Text.span>
              <Text.span color="grey" fontWeight={5}>
                {prettifyBalance(newSptBalance)} SPT
              </Text.span>
            </Flex>
          </Box>
          <Box>
            <RemoveLiquidityButton
              amountOut={poolTokensToRedeem}
              multiple={multiple}
              pool={pool}
              setTransactionLoading={setTransactionLoading}
              loading={loading}
              reload={handleReload}
              selectedOption={
                multiple ? undefined : (selectedOption as ExtendedPoolToken)
              }
            />
            <Button.Outline
              color="primary"
              borderColor="primary"
              border="1.5px solid"
              onClick={onClose}
            >
              {t('navigation:back')}
            </Button.Outline>
          </Box>
        </Flex>
      </Flex>
    </Dialog>
  )
}

export default RemoveLiquidityModal
