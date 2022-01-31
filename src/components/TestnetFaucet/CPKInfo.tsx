import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core'
import { useCpk } from 'src/cpk'
import useAsyncMemo from 'src/hooks/useAsyncMemo'
import { useIsProxyDeployed } from 'src/shared/observables/proxyDeployed'

const CPKInfo = () => {
  const cpk = useCpk()
  const [originalAddress] = useAsyncMemo(
    async () => cpk?.getOwnerAccount(),
    'Unknown',
    [cpk],
  )

  const [connectedNetwork] = useAsyncMemo(async () => cpk?.getNetworkId(), -1, [
    cpk,
  ])

  const [masterCopyVersion] = useAsyncMemo(
    async () => cpk?.getContractVersion(),
    'Unknown',
    [cpk],
  )

  const isProxyDeployed = useIsProxyDeployed()

  return (
    <Table width="100%">
      <TableHead>
        <TableRow>
          <TableCell colSpan={2} align="center">
            <b>Your CPK Info</b>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody style={{ opacity: !cpk ? '.4' : '1' }}>
        <TableRow>
          <TableCell>Original Address</TableCell>
          <TableCell>{originalAddress}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Proxy Contract Address</TableCell>
          <TableCell>{cpk?.address}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Proxy deployed(?)</TableCell>
          <TableCell>{isProxyDeployed ? 'yes' : 'no yet'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Salt nonce</TableCell>
          <TableCell>{cpk?.saltNonce}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Connected network id</TableCell>
          <TableCell>{connectedNetwork || '--'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Master Copy Contract version</TableCell>
          <TableCell>{masterCopyVersion || '--'}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export default CPKInfo
