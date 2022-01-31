import { components } from 'react-select'
import { Text } from 'rimble-ui'
import { useAccount } from 'src/shared/web3'
import equals from 'src/shared/utils/string/equals'
import { ExtractProps } from 'src/shared/types/props'
import StatusBlock from '../StatusBlock'
import TokenIcon from '../TokenIcon'
import StyledSelected from './StyledSelected'

const SingleValue = (props: ExtractProps<typeof components.SingleValue>) => {
  const account = useAccount()
  const { data } = props
  return (
    <components.SingleValue {...props}>
      {' '}
      <StyledSelected>
        <TokenIcon
          symbol={data.label}
          name={data.value}
          width="32px"
          height="32px"
        />
        <Text ml={[2, '10px']} mr="4px">
          {data.label}
        </Text>
        {equals(data.value, account) && (
          <StatusBlock iconSize="12px" iconColor="success" content="" />
        )}
      </StyledSelected>
    </components.SingleValue>
  )
}

export default SingleValue
