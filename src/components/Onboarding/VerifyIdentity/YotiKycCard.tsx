import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Box } from 'rimble-ui'
import useScript from 'src/hooks/useScript'
import { connect } from 'src/state/AppContext'
import { AppState, DispatchWithThunk } from 'src/shared/types/state'
import { yotiTokenSent } from 'src/state/actions/users'
import config from 'src/environment'
import { Yoti } from 'src/declarations'
import YotiButtonInit from 'src/shared/utils/yoti/init'
import blotout from 'src/services/blotout'
import { KycProvider } from 'src/shared/enums'
import KycCard from './KycCard'

let yotiInitiated = false

const { scriptStatusUrl, clientSdkId, scenarioId } = config.yoti

interface YotiCardActions extends Record<string, unknown> {
  sendYotiToken: (token: string, done: () => void) => void
}

const YotiKycCard = ({ sendYotiToken }: YotiCardActions) => {
  const { t } = useTranslation(['onboarding'])
  const scriptStatus = useScript(scriptStatusUrl)
  const yotiButtonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let yotiInstance: Yoti

    if (
      scriptStatus === 'ready' &&
      !yotiInitiated &&
      yotiButtonRef.current?.id
    ) {
      yotiInstance = YotiButtonInit(
        yotiButtonRef.current.id,
        {
          label: t(`verifyIdentity.cards.yoti.button`),
          align: 'center', // "left" | "right"
          width: 'full', // "auto" | "full"
        },
        scenarioId,
        clientSdkId,
        sendYotiToken,
        () => {
          yotiInitiated = true
        },
      )
    }

    return () => {
      if (yotiInstance) {
        yotiInstance.destroy()
      }
      yotiInitiated = false
    }
  }, [sendYotiToken, scriptStatus, t])

  return (
    <KycCard
      vendor="yoti"
      button={<Box height="42px" ref={yotiButtonRef} id="yoti-button" />}
    />
  )
}

const mapDispatchToProps = (dispatch: DispatchWithThunk<AppState>) => ({
  sendYotiToken: (token: string) => {
    dispatch(yotiTokenSent(token))
    blotout.captureKYCStart(KycProvider.yoti)
  },
})

export default connect<
  Record<string, never>,
  Record<string, never>,
  YotiCardActions
>(
  null,
  mapDispatchToProps,
)(YotiKycCard)
