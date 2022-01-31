import React from 'react'
import styled from 'styled-components'
import { Button } from 'rimble-ui'
import useClickAway from 'src/hooks/useClickAway'
import { ChildrenProps } from 'src/shared/types'

const StyledButton = styled(Button.Text)`
  display: inline;
  margin-right: 4px;
  &:focus {
    outline: none;
  }
`

const MenuWrapper = styled.div`
  box-sizing: border-box;
  display: inline-flex;
  position: relative;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
`

const Menu = styled.ul`
  position: absolute;
  padding: 12px 0;
  margin: 0;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
  z-index: ${({ theme }) => theme.zIndices[3]};
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0px 3px 8px rgba(77, 77, 77, 0.25);
  border-radius: 4px;
  list-style: none;
`

const ThreeDotsMenu = ({ children }: ChildrenProps) => {
  const { ref, active, toggle } = useClickAway()

  return (
    <MenuWrapper ref={ref}>
      <StyledButton
        icononly
        icon="MoreVert"
        boxShadow="none"
        minWidth="0"
        size="small"
        height="1rem"
        onClick={toggle}
      />

      {active && <Menu onClick={toggle}>{children}</Menu>}
    </MenuWrapper>
  )
}

export default ThreeDotsMenu
