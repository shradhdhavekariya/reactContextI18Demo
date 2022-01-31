import styled from 'styled-components'
import { Props as ReactSelectProps } from 'react-select/src/Select'
import { ArrowDropDown, ArrowDropUp } from '@rimble/icons'
import ReactSelect from 'react-select'

export const DropdownIndicator = ({ selectProps }: ReactSelectProps) => {
  return selectProps.menuIsOpen ? (
    <ArrowDropUp mr={['6px', '10px']} color="primary" />
  ) : (
    <ArrowDropDown mr={['6px', '10px']} color="primary" />
  )
}

export const StyledSelect = styled(ReactSelect)`
  &.Select {
    width: 164px;
    height: 40px;

    @media (max-width: ${({ theme }) => theme.breakpoints?.[1]}) {
      width: 70px;
    }

    .Select-value {
      display: inline-flex;
      align-items: center;
    }

    .Dropdown__control {
      border-color: ${({ theme }) => theme.colors.grey};
      transition: all ease 0.3s;
      box-shadow: none !important;
      cursor: pointer;
      background: ${({ theme }) => theme.colors['off-white']};
      border-color: ${({ theme }) => theme.colors['off-white']};

      box-shadow: none;

      @media (max-width: ${({ theme }) => theme.breakpoints?.[1]}) {
        background-color: ${({ theme }) => theme.colors.primary};
        border-color: transparent;

        .Dropdown__indicators {
          svg {
            color: white;
          }
        }

        &.Dropdown__control--menu-is-open {
          svg {
            color: ${({ theme }) => theme.colors.primary};
          }
        }
      }
    }

    .Dropdown__indicator-separator {
      display: none;
    }

    .Dropdown__menu {
      width: fit-content;
      margin-top: 10px;
      box-shadow: 0 0 5px 5px rgba(152, 162, 179, 0.15),
        0 12px 24px rgba(152, 162, 179, 0.15);
    }
  }

  & .Select-placeholder {
    font-size: smaller;
  }

  .Dropdown__value-container {
    white-space: nowrap;
  }
`
