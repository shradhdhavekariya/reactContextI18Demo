import styled from 'styled-components'

const AssetRow = styled.tr`
  display: flex;
  flex-direction: column;
  ${(props) => (props.onClick ? 'cursor: pointer;' : '')}

  &:hover {
    background-color: ${({ theme }) => theme?.colors['primary-alpha-03']};
  }

  @media (min-width: ${({ theme }) => theme?.breakpoints[0]}) {
    display: table-row;
  }
`

export default AssetRow
