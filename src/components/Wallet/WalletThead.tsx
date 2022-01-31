import styled from 'styled-components'
import { Flex } from 'rimble-ui'

const StyledThead = styled.thead`
  display: none;

  @media (min-width: ${({ theme }) => theme?.breakpoints[0]}) {
    display: table-header-group;
  }
`

interface WalletTheadProps {
  columns: Array<{
    id: string
    width?: string
    label?: React.ReactNode
    justify?: 'flex-end' | 'flex-start' | 'center'
  }>
}

const WalletThead = ({ columns }: WalletTheadProps) => {
  return (
    <>
      <colgroup>
        {columns.map(({ id, width }) => (
          <col key={id} {...(width && { style: { width } })} />
        ))}
      </colgroup>
      <StyledThead>
        <tr>
          {columns.map(({ id, label, justify }) => (
            <th key={id}>
              {label && (
                <Flex
                  alignItems="center"
                  {...(justify && { justifyContent: justify })}
                >
                  {label}
                </Flex>
              )}
            </th>
          ))}
        </tr>
      </StyledThead>
    </>
  )
}

export default WalletThead
