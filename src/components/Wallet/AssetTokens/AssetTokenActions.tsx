import React, { SyntheticEvent, useState, useEffect, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { isNil } from 'lodash'
import { Button, Loader, Text } from 'rimble-ui'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import { SwapHoriz } from '@rimble/icons'
import match from 'conditional-expression'
import {
  bridgeableTokens,
  bridgeableChainIds,
  usePolygonBridge,
} from 'src/services/polygon-bridge'
import { AssetTokenActionsProps } from 'src/shared/types/props'
import { RouterLink } from 'src/components/common/RouterLink'
import { ReactComponent as PoolIcon } from 'src/assets/icons/Pool.svg'
import { ReactComponent as MaticIcon } from 'src/assets/icons/matic.svg'
import useAsyncState from 'src/hooks/useAsyncState'
import { AllowanceStatus } from 'src/shared/enums'
import { useNetworkId } from 'src/shared/web3'
import ThreeDotsMenu from 'src/components/common/ThreeDotsMenu'
import ThreeDotsMenuOption from 'src/components/common/ThreeDotsMenuOption'
import { useSnackbar } from 'src/components/common/Snackbar'
import { AlertVariant } from 'src/components/common/Snackbar/types'
import ConfirmDisableTokenModal from './ConfirmDisableToken'

const AssetTokenActions: React.FC<AssetTokenActionsProps> = ({
  address,
  symbol,
  name,
  allowanceStatus,
  enable,
  disable,
}: AssetTokenActionsProps) => {
  const { t } = useTranslation('wallet')
  const { addAlert, addError } = useSnackbar()
  const [loading, setLoading] = useState(isNil(allowanceStatus))
  const [isOpen, setIsOpen] = useAsyncState(false)
  const openPolygonBridge = usePolygonBridge()
  const networkId = useNetworkId()

  const closeModal = (event?: SyntheticEvent<Element, Event>) => {
    event?.preventDefault()
    setIsOpen(false)
  }

  const handleAction = async (action: () => Promise<TransactionResponse>) => {
    setLoading(true)
    try {
      const tx = await action()
      await tx.wait()

      const message = `${symbol} (${name}) is ${
        allowanceStatus === AllowanceStatus.NOT_ALLOWED ? 'unlocked' : 'locked'
      }`
      addAlert(message, { variant: AlertVariant.success })
    } catch (e) {
      closeModal()
      addError(e)
    } finally {
      closeModal()
      setLoading(false)
    }
  }

  const openModal = (event: SyntheticEvent<Element, Event>) => {
    event.preventDefault()
    setIsOpen(true)
  }

  const confirmModalProps = {
    isOpen,
    name,
    closeModal,
    disableAction: () => handleAction(disable),
  }

  useEffect(() => {
    if (!isNil(allowanceStatus)) {
      setLoading(false)
    }
  }, [allowanceStatus])

  if (loading) return <Loader m="auto" />

  return (
    <>
      <RouterLink pathname="/swap" queryParams={{ tokenIn: address }}>
        <Button height="28px" px={2}>
          <SwapHoriz size="18px" mr={1} /> {t('assetTokens.actions.swap')}
        </Button>
      </RouterLink>
      <RouterLink pathname="/pools/shared" queryParams={{ assets: address }}>
        <Button height="28px" px={2} ml={3}>
          <Text.span mr={1} lineHeight="20px">
            <PoolIcon height="18px" width="18px" />
          </Text.span>
          <Text.span fontWeight={3} lineHeight="20px">
            {t('assetTokens.actions.pool')}
          </Text.span>
        </Button>
      </RouterLink>
      {bridgeableChainIds.includes(networkId) &&
        bridgeableTokens.includes(symbol.toLocaleLowerCase()) && (
          <Button height="28px" px={2} ml={3} onClick={openPolygonBridge}>
            <Text.span fontWeight={3} lineHeight="20px">
              {t('assetTokens.actions.bridge')}
            </Text.span>
            <Text.span ml={1} pt="2px" lineHeight="16px">
              <MaticIcon height="16px" width="16px" />
            </Text.span>
          </Button>
        )}
      {match(allowanceStatus)
        .equals(AllowanceStatus.NOT_ALLOWED)
        .then(
          <ThreeDotsMenu>
            <ThreeDotsMenuOption
              label="Enable"
              color="primary"
              icon="LockOpen"
              onClick={() => handleAction(enable)}
            />
          </ThreeDotsMenu>,
        )
        .on((value: AllowanceStatus) =>
          [AllowanceStatus.INFINITE, AllowanceStatus.LIMITED].includes(value),
        )
        .then(
          <>
            <ThreeDotsMenu>
              <ThreeDotsMenuOption
                label="Disable"
                color="danger"
                icon="RemoveCircleOutline"
                onClick={openModal}
              />
            </ThreeDotsMenu>
            <ConfirmDisableTokenModal {...confirmModalProps} />
          </>,
        )
        .else(<Text mr="47px" />)}
    </>
  )
}

export default memo(AssetTokenActions)
