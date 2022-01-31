import { Props as ReactSelectProps } from 'react-select'

import { ArrowDropDown, ArrowDropUp } from '@rimble/icons'

const DropdownIndicator = ({ selectProps }: ReactSelectProps) => {
  return selectProps.menuIsOpen ? (
    <ArrowDropUp mr={['6px', '10px']} color="primary" />
  ) : (
    <ArrowDropDown mr={['6px', '10px']} color="primary" />
  )
}

export default DropdownIndicator
