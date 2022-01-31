import styled from 'styled-components'
import { textAlign, TextAlignProps, space } from 'styled-system'

const StyledTable = styled.table<TextAlignProps>`
  border-collapse: collapse;
  width: 100%;

  th {
    color: ${({ theme }) => theme.colors.grey};
    font-size: ${({ theme }) => theme.fontSizes[1]}px;
    font-weight: ${({ theme }) => theme.fontWeights[5]};
    padding: 10px 8px 10px 0;

    ${textAlign}
    &:first-child {
      text-align: left;
    }

    &:last-child {
      text-align: right;
    }
  }

  th,
  tr {
    border-bottom: 1px solid ${({ theme }) => theme.colors['light-gray']};
  }

  td {
    padding: 12px 8px 12px 0;

    &:last-child {
      text-align: right;
      justify-content: flex-end;
    }
  }

  ${space}
`

export default StyledTable
