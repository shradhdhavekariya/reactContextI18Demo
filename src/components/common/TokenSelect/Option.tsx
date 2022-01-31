import { Props as ReactSelectProps } from 'react-select'
import { Text } from 'rimble-ui'
import StyledOption from './StyledOption'
import TokenIcon from '../TokenIcon'

const Option = ({ data, innerRef, innerProps }: ReactSelectProps) => {
  return (
    <StyledOption ref={innerRef} {...innerProps} disabled={data.isDisabled}>
      <TokenIcon
        symbol={data.label}
        name={data.value}
        width="32px"
        height="32px"
      />
      <Text ml={[2, '10px']} mr="4px" color={data.isDisabled ? 'grey' : 'text'}>
        {data.label}
      </Text>
    </StyledOption>
  )
}

export default Option
