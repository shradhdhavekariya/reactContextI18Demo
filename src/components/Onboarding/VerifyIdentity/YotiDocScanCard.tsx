import { useTranslation } from 'react-i18next'
import { connect } from 'src/state/AppContext'
import { AppState, DispatchWithThunk } from 'src/shared/types/state'
import { initYotiDocScan } from 'src/state/actions/users'
import KycCard from './KycCard'
import StyledKycButton from './StyledKycButton'

interface YotiDocScanActions extends Record<string, unknown> {
  init: () => void
}

const YotiDocScanCard = ({ init }: YotiDocScanActions) => {
  const { t } = useTranslation(['onboarding'])

  return (
    <KycCard
      vendor="docScan"
      button={
        <StyledKycButton
          style={{
            textTransform: 'uppercase',
            fontSize: 12,
          }}
          onClick={init}
        >
          {t(`verifyIdentity.cards.docScan.button`)}
        </StyledKycButton>
      }
    />
  )
}

const mapDispatchToProps = (dispatch: DispatchWithThunk<AppState>) => ({
  init: () => dispatch(initYotiDocScan()),
})

export default connect<
  Record<string, never>,
  Record<string, never>,
  YotiDocScanActions
>(
  null,
  mapDispatchToProps,
)(YotiDocScanCard)
