import styled from 'styled-components'

interface LabelProps {
  right?: boolean
  mobile?: boolean
}

const Label = styled.label<LabelProps>`
  font-size: ${({ theme }) => theme.fontSizes[1]};
  font-weight: ${({ theme, right }) => theme.fontWeights[right ? 2 : 5]};
  margin-bottom: ${({ theme }) => theme.space[1]}px;
  text-align: ${({ right }) => (right ? 'right' : 'left')};
  display: flex;
  width: 100%;
  color: ${({ theme, right }) => theme.colors[right ? 'grey' : 'near-black']};
  display: ${({ mobile }) => (mobile ? 'block' : 'none')};
  min-height: 20px;

  @media (min-width: ${({ theme }) => theme.breakpoints[0]}) {
    margin-bottom: ${({ theme }) => theme.space[2]}px;
    display: block;
  }
`

export default Label
