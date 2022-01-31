import {
  Button,
  ButtonProps,
  CircularProgress,
  TableCell,
  TableRow,
} from '@material-ui/core'
import { useCallback, useState } from 'react'
import useTransactionAlerts from 'src/hooks/useTransactionAlerts'
import { ExtendedPoolToken } from 'src/shared/types/tokens'
import { denormalize } from 'src/shared/utils/big-helpers'
import { useSnackbar } from '../common/Snackbar'

const mintAmountsMap: Record<string, number> = {
  dai: 1000,
  wbtc: 0.1,
  usdc: 1000,
  // weth: 0.1,
}

const LoadingButton = ({
  loading,
  ...buttonProps
}: ButtonProps & { loading: boolean }) => (
  <Button
    variant="outlined"
    size="small"
    {...buttonProps}
    disabled={loading || buttonProps.disabled}
  >
    {loading ? <CircularProgress size={22} /> : buttonProps.children}
  </Button>
)

const FaucetTokenRow = ({
  token,
  cpkAddress,
}: {
  token: ExtendedPoolToken
  cpkAddress?: string
}) => {
  const { track } = useTransactionAlerts()
  const { addError } = useSnackbar()
  const [unlockLoading, setUnlockLoading] = useState(false)
  const [lockLoading, setLockLoading] = useState(false)
  const [mintLoading, setMintLoading] = useState(false)

  const handleUnlockToken = useCallback(async () => {
    if (!cpkAddress) return

    setUnlockLoading(true)
    try {
      const tx = await token.contract?.enableToken(cpkAddress)
      await track(tx)
    } catch (err) {
      addError(err)
    } finally {
      setUnlockLoading(false)
    }
  }, [addError, cpkAddress, token.contract, track])

  const handleLockToken = useCallback(async () => {
    if (!cpkAddress) return

    setLockLoading(true)
    try {
      const tx = await token.contract?.disableToken(cpkAddress)
      await track(tx)
    } catch (err) {
      addError(err)
    } finally {
      setLockLoading(false)
    }
  }, [addError, cpkAddress, token.contract, track])

  const handleMintToken = useCallback(async () => {
    if (!mintAmountsMap[token.symbol.toLowerCase()]) return
    setMintLoading(true)
    try {
      const tx = await token.contract?.mint(
        denormalize(mintAmountsMap[token.symbol.toLowerCase()], token.decimals),
      )
      await track(tx)
    } catch (err) {
      addError(err)
    } finally {
      setMintLoading(false)
    }
  }, [addError, token.contract, token.decimals, token.symbol, track])

  return (
    <TableRow key={token.id}>
      <TableCell>{token.name}</TableCell>
      <TableCell align="right">
        <b>{token.balance?.toNumber()}</b> {token.symbol}
      </TableCell>
      <TableCell align="right">
        <b>{token.cpkBalance?.toNumber()}</b> {token.symbol}
      </TableCell>
      <TableCell>
        <LoadingButton
          loading={unlockLoading}
          disabled={!token.cpkAllowance?.eq(0) || !cpkAddress}
          onClick={handleUnlockToken}
        >
          Enable
        </LoadingButton>
        <LoadingButton
          loading={lockLoading}
          disabled={!token.cpkAllowance?.gt(0) || !cpkAddress}
          onClick={handleLockToken}
        >
          Disable
        </LoadingButton>
        {!!mintAmountsMap?.[token.symbol.toLowerCase()] && (
          <LoadingButton onClick={handleMintToken} loading={mintLoading}>
            Mint {mintAmountsMap?.[token.symbol.toLowerCase()] || 0}{' '}
            {token.symbol}
          </LoadingButton>
        )}
      </TableCell>
    </TableRow>
  )
}

export default FaucetTokenRow
