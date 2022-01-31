import styled from 'styled-components'

const Dot = styled.span`
  display: inline-block;
  background-color: ${({ color }) => color};
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: ${({ theme }) => theme.space[1]}px;
`

export default Dot
