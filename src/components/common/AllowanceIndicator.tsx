import { Icon } from 'rimble-ui'
import match from 'conditional-expression'
import { AllowanceStatus } from 'src/shared/enums'
import { AssetToken } from 'src/shared/types/tokens'

const AllowanceIndicator = ({
  allowanceStatus,
}: Pick<AssetToken, 'allowanceStatus'>) =>
  match(allowanceStatus)
    .equals(AllowanceStatus.NOT_ALLOWED)
    .then(<Icon name="LockOutline" title="Locked" size="16" color="red" />)
    .equals(AllowanceStatus.LIMITED)
    .then(
      <Icon
        name="LockOpen"
        title="Unlocked & Limited"
        size="16"
        color="success"
      />,
    )
    .equals(AllowanceStatus.INFINITE)
    .then(
      <>
        <Icon
          name="LockOpen"
          title="Unlocked & Unlimited"
          size="16"
          color="success"
        />
        <sup>
          <Icon
            title="Unlocked & Limited"
            name="AllInclusive"
            size="12"
            color="success"
          />
        </sup>
      </>,
    )
    .else(null)

export default AllowanceIndicator
