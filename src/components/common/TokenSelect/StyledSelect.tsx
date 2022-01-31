import ReactSelect from 'react-select'
import styled from 'styled-components'

const StyledSelect = styled(ReactSelect)`
  &.Select {
    width: fit-content;
    min-width: 130px;

    .Select-value {
      display: inline-flex;
      align-items: center;
    }

    .Dropdown__control {
      border: none;
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

export default StyledSelect
