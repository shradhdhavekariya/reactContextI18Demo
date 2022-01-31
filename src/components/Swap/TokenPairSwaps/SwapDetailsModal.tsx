import { useCallback } from 'react'
import { Button, Box, Link, Loader } from 'rimble-ui'
import { useTranslation } from 'react-i18next'
import { fromUnixTime, format } from 'date-fns'
import { AlertVariant } from 'src/components/common/Snackbar/types'
import { useSnackbar } from 'src/components/common/Snackbar'
import StyledOutlineButton from 'src/components/common/StyledOutlineButton'
import Grid from 'src/components/common/Grid'
import { generateEtherscanUrl } from 'src/utils'
import DetailBlock from 'src/components/common/DetailBlock'
import Dialog from 'src/components/common/Dialog'
import { Swap } from 'src/shared/types'
import { recursiveRound } from 'src/shared/utils'
import useAsyncMemo from 'src/hooks/useAsyncMemo'
import useObservable from 'src/shared/hooks/useObservable'
import { walletProvider$, useNetworkId } from 'src/shared/web3'

interface SwapDetailsModalProps {
  onClose: () => void
  swap: Swap
}

const SwapDetailsModal = ({ onClose, swap }: SwapDetailsModalProps) => {
  const { addAlert } = useSnackbar()
  const networkId = useNetworkId()
  const { t } = useTranslation('swap')
  const provider = useObservable(walletProvider$)
  const date = fromUnixTime(swap.timestamp)
  const hash = swap.id.slice(0, swap.id.indexOf('-'))

  const handleCopyAddress = useCallback(() => {
    navigator.clipboard.writeText(hash)

    addAlert(t('recentSwaps.modal.copiedToClipboard'), {
      variant: AlertVariant.success,
      autoDismissible: true,
    })
  }, [addAlert, hash, t])

  const [tx] = useAsyncMemo(
    async () =>
      provider?.getTransaction(swap.id.slice(0, swap.id.indexOf('-'))),
    null,
    [provider, swap.id],
  )

  return (
    <Dialog
      isOpen
      width={['100%', '540px']}
      onClose={onClose}
      title={t('recentSwaps.modal.header')}
    >
      <Box>
        <Box>
          <DetailBlock
            bold
            namespace="swap"
            label="recentSwaps.modal.status"
            content="Completed"
            color="success"
          />
        </Box>
        <Grid gridTemplateColumns="1fr 1fr">
          <DetailBlock
            namespace="swap"
            label="recentSwaps.modal.swappedFrom"
            content={`${swap.tokenAmountIn} ${swap.tokenInSym}`}
          />
          <DetailBlock
            namespace="swap"
            label="recentSwaps.modal.swappedTo"
            content={`${swap.tokenAmountOut} ${swap.tokenOutSym}`}
          />
          <DetailBlock
            namespace="swap"
            label="recentSwaps.modal.transactionTime"
            content={format(date, 'hh:mm aa MM/dd/yyyy')}
          />
          <DetailBlock
            namespace="swap"
            label="recentSwaps.modal.priceAtTransaction"
            content={`1 ${swap.tokenInSym} = ${recursiveRound(
              Number(swap.tokenAmountOut) / Number(swap.tokenAmountIn),
              { base: 6 },
            )} ${swap.tokenOutSym}`}
          />
        </Grid>
        <DetailBlock
          bold
          namespace="swap"
          label="recentSwaps.modal.networkConfirmations"
          content={tx?.confirmations.toString() || <Loader />}
        />
        <Box>
          <DetailBlock
            bold
            namespace="swap"
            label="recentSwaps.modal.transactionHash"
            content={hash}
          />

          <Box>
            <Button.Text
              fontWeight={4}
              fontSize={1}
              mx={0}
              p={0}
              minWidth={0}
              mt={2}
              height="fit-content"
              onClick={handleCopyAddress}
            >
              {t('recentSwaps.modal.copy')}
            </Button.Text>

            {networkId && (
              <Link
                href={generateEtherscanUrl({
                  type: 'tx',
                  hash,
                  chainId: networkId,
                })}
                target="_blank"
                fontWeight={4}
                fontSize={1}
                hoverColor="primary"
                ml={2}
              >
                {t('recentSwaps.modal.viewOnEtherscan')}
              </Link>
            )}
          </Box>
          <Box>
            <StyledOutlineButton
              width="100%"
              mt="24px"
              fontWeight={4}
              onClick={onClose}
            >
              {t('recentSwaps.modal.close')}
            </StyledOutlineButton>
          </Box>
        </Box>
      </Box>
    </Dialog>
  )
}

export default SwapDetailsModal
