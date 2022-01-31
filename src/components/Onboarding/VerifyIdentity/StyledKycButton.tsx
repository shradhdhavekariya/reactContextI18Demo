import styled from 'styled-components'
import { Button } from 'rimble-ui'

const StyledButton = styled(Button)`
    border-radius: ${({ theme }) => theme.radii[2]};
    width: 100%
    height: 42px;
    font-size: ${({ theme }) => theme.fontSizes[2]}px;
    padding: ${({ theme }) => `${theme.space[2]}px ${theme.space[3]}px}`};
    justify-content: center;
    font-weight: ${({ theme }) => theme.fontWeights[4]};

    &:before {
        background-color: #229dff;
    }

    &:hover {
        box-shadow: none;

        &:before {
            background-color: ${({ theme }) => theme.colors.primary};
        }
    }
`

export default StyledButton
