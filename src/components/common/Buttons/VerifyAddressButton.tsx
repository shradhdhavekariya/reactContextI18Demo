import { ReactElement } from 'react'
import StyledButton from 'src/components/StyledButton'
import useVerify from 'src/hooks/useVerify'
import useObservable from 'src/shared/hooks/useObservable'
import isAccountRegistered$ from 'src/shared/observables/isAccountRegistered'
import Translate from '../Translate'

interface VerifyAddressButtonProps {
  onNext?: () => void
  render?: (
    verify: () => Promise<void>,
    loading: boolean,
    isRegistered: boolean,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => ReactElement<any, any> | null
}

const VerifyAddressButton = ({
  render = (verify: () => Promise<void>, loading: boolean) => (
    <StyledButton onClick={verify} disabled={loading}>
      <Translate namespaces={['onboarding']}>
        verifyAddress.verifyButton
      </Translate>
    </StyledButton>
  ),
}: VerifyAddressButtonProps) => {
  const isRegistered = useObservable<boolean>(isAccountRegistered$, false)
  const { verify, loading } = useVerify()

  return render(verify, loading, !!isRegistered)
}

export default VerifyAddressButton
