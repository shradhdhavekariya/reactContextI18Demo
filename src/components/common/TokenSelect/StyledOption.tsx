import styled from 'styled-components'

const StyledOption = styled.div<{ disabled: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 6px 10px;

  img {
    width: 20px;
    height: 20px;
  }

  &:hover {
    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints[0]}) {
    padding: 12px;
  }
`

export default StyledOption
