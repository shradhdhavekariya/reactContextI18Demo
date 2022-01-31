import useAsyncState from 'src/hooks/useAsyncState'
import { ExtractProps } from 'src/shared/types/props'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import { Loader, Button } from 'rimble-ui'
import { FORBIDDEN_TIERS } from 'src/shared/consts/tiers'
import VerifyAddressButton from 'src/components/common/Buttons/VerifyAddressButton'
import { Tier } from 'src/shared/enums'
import { useInitiated, useTier, useIsLoggedIn } from 'src/state/hooks'
import { useAccount } from 'src/shared/web3'
import { tierAtLeast } from 'src/utils'
import ConnectWalletButton from './ConnectWalletButton'

export const LoaderButton = ({
  component = Button,
  onClick,
  disabled,
  loadingText,
  children,
  loading = false,
  ...props
}: ExtractProps<typeof Button>) => {
  const [actionLoading, setActionLoading] = useAsyncState(false)
  const handleOnClick = () => {
    const promise = onClick()

    if (promise instanceof Promise) {
      setActionLoading(true)
      promise.finally(() => setActionLoading(false))
    }
  }

  const Tag = component

  return (
    <Tag
      {...props}
      onClick={handleOnClick}
      disabled={disabled || loading || actionLoading}
    >
      {loading || actionLoading
        ? loadingText || <Loader color="white" />
        : children}
    </Tag>
  )
}

interface SmartButtonProps {
  requireTier?: Tier
  requireAccount?: boolean
  requireInitiated?: boolean
  requireLogin?: boolean
  loading?: boolean
}

const SmartButton = ({
  requireInitiated = false,
  requireAccount = false,
  requireTier = false,
  requireLogin = false,
  ...props
}: SmartButtonProps & ExtractProps<typeof Button>) => {
  const initiated = useInitiated()
  const account = useAccount()
  const tier = useTier()
  const history = useHistory()
  const isLoggedIn = useIsLoggedIn()
  const { t } = useTranslation(['onboarding', 'alerts'])

  const goToOnboarding = useCallback(() => history.push('/onboarding'), [
    history,
  ])

  if (requireInitiated && !initiated) {
    return <LoaderButton {...props} loading disabled />
  }

  if (requireAccount && !account) {
    return (
      <ConnectWalletButton
        render={(connect) => (
          <LoaderButton {...props} disabled={false} onClick={connect}>
            {t('alerts:connect.button')}
          </LoaderButton>
        )}
      />
    )
  }

  if (requireLogin && !isLoggedIn) {
    return (
      <VerifyAddressButton
        render={(verify) => (
          <LoaderButton {...props} disabled={false} onClick={verify}>
            {t('alerts:signIn.button')}
          </LoaderButton>
        )}
      />
    )
  }

  if (requireTier && FORBIDDEN_TIERS.includes(tier)) {
    return <LoaderButton {...props} disabled />
  }

  if (
    [Tier.tier1, Tier.tier2].includes(requireTier) &&
    !tierAtLeast(requireTier)(tier)
  ) {
    return (
      <LoaderButton {...props} disabled={false} onClick={goToOnboarding}>
        {t('alerts:completePassport.button')}
      </LoaderButton>
    )
  }

  return <LoaderButton {...props} />
}

SmartButton.Outline = function OutlineButton(
  props: ExtractProps<typeof Button>,
) {
  return <SmartButton {...props} component={Button.Outline} />
}

export default SmartButton
