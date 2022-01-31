import Big from 'big.js'
import { useMemo, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Text, Loader, Flex, Button } from 'rimble-ui'
import { Formik } from 'formik'
import {
  calcMaxAmountsIn,
  calcPoolOutGivenSingleIn,
  calcPoolTokensByRatio,
} from 'src/shared/utils/pool-calc'
import { calculateRatio } from 'src/shared/utils/pool'
import { prettifyBalance } from 'src/shared/utils'
import AddLiquidityAssetList from 'src/components/Liquidity/LiquidityModals/AddLiquidityModal/AddLiquidityAssetList'
import TransactionForbidden from 'src/components/FlashToasts/TransactionForbidden'
import { ExtendedPoolToken } from 'src/shared/types/tokens'
import Dialog from 'src/components/common/Dialog'
import { LiquidityModalProps } from 'src/shared/types/props'
import H4 from 'src/components/Liquidity/H4'
import PoolOverview from 'src/components/Liquidity/PoolOverview'
import { propEquals } from 'src/shared/utils/collection/filters'
import AddLiquidityButton from './AddLiquidityButton'
import { initialValues } from './consts'
import ValidationError from './ValidationErrors'

const AddLiquidityModal = ({
  pool,
  isOpen = false,
  onClose,
  reload,
  loading = false,
}: LiquidityModalProps) => {
  const { t } = useTranslation(['liquidityModals', 'navigation'])
  const [selectedOption, setSelectedOption] = useState<
    ExtendedPoolToken | 'all'
  >('all')

  useEffect(() => {
    const multipleAvailable = pool.tokens.every(
      ({ usdBalance }) => !!usdBalance,
    )
    const firstPositiveToken = pool.tokens.find(
      ({ usdBalance }) => !!usdBalance,
    )
    if (multipleAvailable) {
      setSelectedOption('all')
    } else if (firstPositiveToken) {
      setSelectedOption(firstPositiveToken)
    }
  }, [pool.tokens])

  const [liquidityToAdd, setLiquidityToAdd] = useState(0)
  const [transactionLoading, setTransactionLoading] = useState(false)
  const handleOnSelection = (token: ExtendedPoolToken | 'all') => {
    setLiquidityToAdd(0)
    setSelectedOption(token)
  }

  const multiple = selectedOption === 'all'

  const maxAmountsIn = useMemo(() => calcMaxAmountsIn(pool.tokens), [
    pool.tokens,
  ])

  const ratio =
    multiple && pool.tokens?.length
      ? (liquidityToAdd / 100) * calculateRatio(pool.tokens)
      : 0

  const poolTokensToIssue = multiple
    ? calcPoolTokensByRatio(ratio, pool.totalShares)
    : calcPoolOutGivenSingleIn(
        liquidityToAdd,
        selectedOption as ExtendedPoolToken,
        pool,
      )

  const userPoolTokenBalance = new Big(pool?.cpkBalance || 0)

  const newSptBalance = poolTokensToIssue.add(userPoolTokenBalance)

  const poolOverviewProps = {
    poolTokensToIssue,
    userPoolTokenBalance,
    tokens: pool.tokens,
    id: pool.id || '',
    swapFee: pool.swapFee,
    totalShares: pool.totalShares || '0',
    action: 'add',
  }

  useEffect(() => {
    if (selectedOption !== 'all') {
      const newToken = pool.tokens.find(
        propEquals('address', (selectedOption as ExtendedPoolToken)?.address),
      )

      if (newToken && selectedOption !== newToken) {
        setSelectedOption(newToken)
      }
    }
  }, [pool.tokens, selectedOption])

  const handleReload = () => {
    reload?.()
    setLiquidityToAdd(0)
    onClose?.()
  }

  return (
    <Dialog
      isOpen={isOpen}
      width={['100%', 'auto']}
      minWidth={[0, 0, '800px']}
      onClose={onClose}
      title={t('add.header')}
      p="24px"
    >
      <TransactionForbidden />
      <Flex overflow="hidden" display="flex" flexDirection="row">
        <PoolOverview {...poolOverviewProps} action="add" />
        <Formik initialValues={initialValues} onSubmit={() => {}}>
          <Flex pl="24px" flex="1 1 auto" flexDirection="column">
            <H4 text={t('add.selectAssetsToAdd')} />
            {!pool.tokens.length ? (
              <Flex justifyContent="center" alignItems="center" height="100%">
                <Loader size="48px" />
              </Flex>
            ) : (
              <AddLiquidityAssetList
                tokens={pool.tokens}
                selected={
                  selectedOption === 'all'
                    ? selectedOption
                    : selectedOption?.address
                }
                onSelection={handleOnSelection}
                value={liquidityToAdd}
                onChange={setLiquidityToAdd}
                maxAmountsIn={maxAmountsIn}
                disabled={transactionLoading}
              />
            )}
            <Box width="100%" px={2} mb="24px">
              <Flex justifyContent="space-between" height="24px">
                <Text.span>SPT amount:</Text.span>
                <Text.span
                  color={poolTokensToIssue.eq(0) ? 'grey' : 'success'}
                  fontWeight={5}
                >
                  {poolTokensToIssue.eq(0)
                    ? 0
                    : `+ ${prettifyBalance(poolTokensToIssue)}`}{' '}
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
            <ValidationError px={2} mb={3} />
            <Flex alignItems="center">
              <AddLiquidityButton
                pool={pool}
                multiple={multiple}
                selectedOption={
                  multiple ? undefined : (selectedOption as ExtendedPoolToken)
                }
                reload={handleReload}
                amountOut={poolTokensToIssue}
                loading={loading}
                setTransactionLoading={setTransactionLoading}
              />
              <Button.Outline
                color="primary"
                borderColor="primary"
                border="1.5px solid"
                onClick={onClose}
              >
                {t('navigation:back')}
              </Button.Outline>
            </Flex>
          </Flex>
        </Formik>
      </Flex>
    </Dialog>
  )
}

export default AddLiquidityModal
