import styled from 'styled-components'
import { ReactComponent as Icon } from 'src/assets/icons/Passport.svg'
import { connect } from 'src/state/AppContext'
import { AppState } from 'src/shared/types/state'
import { hasCompletedVerification } from 'src/utils'
import { VerificationStatus } from 'src/shared/enums'

const Wrapper = styled.div<{ verified: boolean }>`
  position: relative;
  display: inline-block;

  &:after {
    content: '';
    display: block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: ${({ verified, theme }) =>
      verified ? theme.colors.success : theme.colors.danger};
    position: absolute;
    top: -5px;
    right: 0;
  }
`
type PassportIconProps = React.SVGProps<SVGSVGElement> & {
  title?: string | undefined
}

interface PassportIconStateProps extends Record<string, unknown> {
  verified: boolean
}

const PassportIcon = (props: PassportIconProps & PassportIconStateProps) => {
  const { verified, ...rest } = props

  return (
    <Wrapper verified={verified}>
      <Icon {...rest} />
    </Wrapper>
  )
}

const mapStateToProps = ({ user }: AppState) => ({
  verified: hasCompletedVerification(VerificationStatus.kycVerified)(
    user.verificationStatus,
  ),
})

export default connect<PassportIconProps, PassportIconStateProps>(
  mapStateToProps,
)(PassportIcon)
