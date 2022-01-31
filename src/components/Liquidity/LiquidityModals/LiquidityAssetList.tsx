import styled from 'styled-components'

const LiquidityAssetList = styled.ul`
  list-style: none;
  padding: 0;
  padding-right: 8px;
  overflow-y: auto;
  flex: 1 1 auto;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;

  & > li {
    padding: 16px 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors['light-gray']};
    scroll-snap-align: start;

    & input {
      outline: none;
    }

    &:first-child {
      padding-top: 0;
    }
  }
`

export default LiquidityAssetList
