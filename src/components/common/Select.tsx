import React from 'react'
import ReactSelect, { Props as ReactSelectProps } from 'react-select'
import styled from 'styled-components'
import { Text } from 'rimble-ui'
import { ArrowDropDown, ArrowDropUp } from '@rimble/icons'

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
  return (
    <StyledOption ref={innerRef} {...innerProps} disabled={data.isDisabled}>
      <Text ml={[2, '10px']} mr="4px" color={data.isDisabled ? 'grey' : 'text'}>
        {data.value}
      </Text>
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

const StyledSelect = styled(ReactSelect)`
  &.Select {
    width: 100%;

    .Select-value {
      display: inline-flex;
      align-items: center;
    }

    .Dropdown__control {
      border-color: ${({ theme }) => theme.colors.grey};
      height: 100%;
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

const Select = (props: ReactSelectProps) => (
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
    }}
  />
)

export default Select
