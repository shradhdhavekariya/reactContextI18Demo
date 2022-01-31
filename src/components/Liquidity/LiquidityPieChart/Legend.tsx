import { HTMLAttributes } from 'react'
import styled from 'styled-components'
import { margin, MarginProps } from 'styled-system'

const Legend = styled.ul<HTMLAttributes<HTMLUListElement> & MarginProps>`
  list-style: none;
  margin: 0;
  padding: 0;

  ${margin}

  & > li {
    display: flex;
    align-items: center;
    font-size: ${({ theme }) => theme.fontSizes[1]}px;
    padding: 8px 0;
  }
`
export default Legend
