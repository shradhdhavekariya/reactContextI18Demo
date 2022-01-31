import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Props as ReactSelectProps } from 'react-select/src/Select'
import { Text } from 'rimble-ui'
import { Done } from '@rimble/icons'
import { NetworkId } from 'src/shared/types/config'
import { ReactComponent as EthereumIcon } from 'src/assets/icons/Ethereum-Logo.wine.svg'
import { ReactComponent as PolygonIcon } from 'src/assets/icons/Polygon.svg'
import { ReactComponent as Bridge } from 'src/assets/icons/Bridge.svg'
import config from 'src/environment'
import Divider from '../Divider'

const { isProduction } = config

export interface INetworkOption {
  value: NetworkId | 'Bridge'
  label: string
  icon?: ReactNode
  disabled?: boolean
  divider?: boolean
}

export const networkOptions: INetworkOption[] = [
  {
    icon: <EthereumIcon />,
    value: isProduction() ? 1 : 4,
    label: 'Ethereum',
  },
  {
    icon: <PolygonIcon />,
    value: isProduction() ? 137 : 80001,
    label: 'Polygon',
  },
  {
    icon: <Bridge />,
    value: 'Bridge',
    label: 'Bridge',
    divider: true,
  },
]

const StyledOption = styled.div<{ disabled: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 200px;
  height: 36px;
  padding: 2px 12px;
  transition: all ease 0.3s;
  border-radius: 4px;

  &:hover {
    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
    background: ${({ theme }) => theme.colors['off-white']};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints?.[1]}) {
    width: 130px;

    .option-value {
      margin-right: 10px !important;
    }
  }

  svg {
    width: 20px;
    height: 20px;
  }
`

export const Option = ({
  data,
  innerRef,
  innerProps,
  isSelected,
}: ReactSelectProps) => {
  return (
    <>
      {data.divider && <Divider my={2} />}
      <StyledOption ref={innerRef} {...innerProps} disabled={data.isDisabled}>
        {data.icon}
        <Text
          className="option-value"
          ml={[2, '10px']}
          mr="auto"
          color={data.isDisabled ? 'grey' : 'text'}
        >
          {data.label}
        </Text>
        {isSelected && <Done color="primary" />}
      </StyledOption>
    </>
  )
}
