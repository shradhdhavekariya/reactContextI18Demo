import React from 'react'
import { useTranslation } from 'react-i18next'
import { AppState, DispatchWithThunk } from 'src/shared/types/state'
import { initYesFlow } from 'src/state/actions/users'
import { connect } from 'src/state/AppContext'
import blotout from 'src/services/blotout'
import { KycProvider } from 'src/shared/enums'
import KycCard from './KycCard'
import StyledKycButton from './StyledKycButton'

interface YesKycCardActions extends Record<string, unknown> {
  init: () => void
}

const YesKycCard = ({ init: initYes }: YesKycCardActions) => {
  const { t } = useTranslation(['onboarding'])

  const init = () => {
    initYes()
    blotout.captureKYCStart(KycProvider.yes)
  }

  return (
    <KycCard
      vendor="yes"
      button={
        <StyledKycButton onClick={init}>
          {t(`verifyIdentity.cards.yes.button`)}
        </StyledKycButton>
      }
    />
  )
}

const mapDispatchToProps = (
  dispatch: DispatchWithThunk<AppState>,
): YesKycCardActions => ({
  init: () => dispatch(initYesFlow()),
})

export default connect<
  Record<string, never>,
  Record<string, never>,
  YesKycCardActions
>(
  null,
  mapDispatchToProps,
)(YesKycCard)
