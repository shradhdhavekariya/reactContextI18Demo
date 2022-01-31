import {
  Box,
  Button,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core'
import { useCallback, useMemo, useState } from 'react'
import Content from 'src/components/common/Content'
import Layout from 'src/components/common/Layout'
import { useCpk } from 'src/cpk'
import { useNativeTokens } from 'src/hooks/subgraph'
import useTransactionAlerts from 'src/hooks/useTransactionAlerts'
import { POLL_INTERVAL } from 'src/shared/consts/time'
import { ExtendedPoolToken } from 'src/shared/types/tokens'
import { denormalize } from 'src/shared/utils/big-helpers'
import {
  injectBalance,
  injectContract,
  injectCpkAllowance,
  injectExchangeRate,
  useInjections,
} from 'src/shared/utils/tokens/injectors'
import { useAccount, useReadyState } from 'src/shared/web3'
import CPKInfo from 'src/components/TestnetFaucet/CPKInfo'
import FaucetTokenRow from 'src/components/TestnetFaucet/FaucetTokenRow'

const TestnetFaucet = () => {
  const account = useAccount()
  const cpk = useCpk()
  const ready = useReadyState()
  const { track } = useTransactionAlerts()
  const [batchTxLoading, setBatchTxLoading] = useState(false)

  const { nativeTokens, loading } = useNativeTokens<ExtendedPoolToken>({
    skip: !ready,
    variables: { filter: { symbol_not: 'SPT' } },
    pollInterval: POLL_INTERVAL,
  })

  const fullTokens = useInjections<ExtendedPoolToken>(
    nativeTokens,
    useMemo(
      () => [
        injectBalance(account),
        injectBalance(cpk?.address, 'cpkBalance'),
        injectCpkAllowance(account),
        injectContract(),
        injectExchangeRate(),
      ],
      [account, cpk?.address],
    ),
  )

  const transferTokensToCPK = useCallback(async () => {
    if (!account) return
    try {
      setBatchTxLoading(true)
      cpk?.resetStoredTxs()

      fullTokens.forEach((token) => {
        const amountToTransfer = token.balance?.div(10) || 0
        if (token.balance?.gt(0) && token.cpkAllowance?.gte(amountToTransfer)) {
          cpk?.transferTokenFrom(
            account,
            token.id,
            denormalize(token.balance.div(100), token.decimals),
          )
        }
      })

      const tx = await cpk?.execStoredTxs()
      await track(tx)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    } finally {
      setBatchTxLoading(false)
    }
  }, [account, cpk, fullTokens, track])

  return (
    <Layout header="Testnet Faucet">
      <Content bg="background">
        <CPKInfo />
        <hr />
        <Box width="100%" textAlign="center">
          <Button
            variant="contained"
            size="small"
            onClick={transferTokensToCPK}
          >
            Transfer 10% of your assets to CPK
          </Button>
          {(loading || batchTxLoading) && <LinearProgress />}
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Token</TableCell>
              <TableCell align="center">Balance</TableCell>
              <TableCell align="center">CPK Balance</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fullTokens.map((token) => (
              <FaucetTokenRow
                key={token.id}
                token={token}
                cpkAddress={cpk?.address}
              />
            ))}
          </TableBody>
        </Table>
      </Content>
    </Layout>
  )
}

export default TestnetFaucet
