import ReactSelect, {
  Props as ReactSelectProps,
  components,
} from 'react-select'
import styled from 'styled-components'
import { Text } from 'rimble-ui'
import { ArrowDropDown, ArrowDropUp } from '@rimble/icons'
import { ExtractProps } from 'src/shared/types/props'
import Blockie from 'src/components/common/Blockie'
import equals from 'src/shared/utils/string/equals'
import { useAccount } from 'src/shared/web3'
import { truncateStringInTheMiddle } from 'src/utils'
import StatusBlock from './StatusBlock'

const StyledSelected = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`

const StyledOption = styled.div<{ disabled: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 6px 10px;

  &:hover {
    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints[0]}) {
    padding: 12px;
  }
`

const Option = ({ data, innerRef, innerProps }: ReactSelectProps) => {
  const account = useAccount()

  return (
    <StyledOption ref={innerRef} {...innerProps} disabled={data.isDisabled}>
      <Blockie address={data.value} />
      {data.label ? (
        <>
          <Text
            ml={[2, '10px']}
            mr="4px"
            color={data.isDisabled ? 'grey' : 'text'}
          >
            {data.label}
          </Text>
          {data.value && (
            <Text ml={[2, '10px']} mr="4px" color="grey">
              ({truncateStringInTheMiddle(data.value ?? account ?? '')})
            </Text>
          )}
        </>
      ) : (
        <Text ml={[2, '10px']} mr="4px">
          {data.value ?? account ?? ''}
        </Text>
      )}
      {equals(data.value, account) && (
        <StatusBlock iconSize="12px" iconColor="success" content="" />
      )}
    </StyledOption>
  )
}

const DropdownIndicator = ({ selectProps }: ReactSelectProps) => {
  return selectProps.menuIsOpen ? (
    <ArrowDropUp mr={['6px', '10px']} color="primary" />
  ) : (
    <ArrowDropDown mr={['6px', '10px']} color="primary" />
  )
}

const SingleValue = (props: ExtractProps<typeof components.SingleValue>) => {
  const account = useAccount()
  const { data } = props

  return (
    <components.SingleValue {...props}>
      {' '}
      <StyledSelected>
        <Blockie address={data.value} />
        {data.label ? (
          <>
            <Text ml={[2, '10px']} mr="4px">
              {data.label}
            </Text>
            <Text ml={[2, '10px']} mr="4px" color="grey">
              ({truncateStringInTheMiddle(data.value ?? account ?? '')})
            </Text>
          </>
        ) : (
          <Text ml={[2, '10px']} mr="4px">
            {data.value ?? account ?? ''}
          </Text>
        )}
        {equals(data.value, account) && (
          <StatusBlock iconSize="12px" iconColor="success" content="" />
        )}
      </StyledSelected>
    </components.SingleValue>
  )
}

const StyledSelect = styled(ReactSelect)`
  &.Select {
    width: 100%;

    .Select-value {
      display: inline-flex;
      align-items: center;
    }

    .Dropdown__control {
      border-color: ${({ theme }) => theme.colors.grey};
    }

    .Dropdown__indicator-separator {
      display: none;
    }

    .Dropdown__menu {
      margin-top: 4px;
    }
  }
  & .Select-placeholder {
    font-size: smaller;
  }
`

const AddressSelect = (props: ReactSelectProps) => (
  <StyledSelect
    {...props}
    isSearchable={false}
    className="Select"
    classNamePrefix="Dropdown"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    styles={{ valueContainer: (base: any) => ({ ...base, cursor: 'pointer' }) }}
    components={{
      Option,
      DropdownIndicator,
      SingleValue,
    }}
  />
)

export default AddressSelect
