import { Props as ReactSelectProps } from 'react-select'
import StyledSelect from './StyledSelect'
import Option from './Option'
import DropdownIndicator from './DropdownIndicator'
import SingleValue from './SingleValue'

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
      SingleValue,
    }}
  />
)

export default Select
