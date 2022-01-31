import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex } from 'rimble-ui'
import Header from './Header'
import Menu from './Menu'

const StyledNavigation = styled(Flex)`
  position: fixed;
  top: 0;
  flex-direction: column;
  z-index: ${({ theme }) => theme.zIndices[4]};
  height: ${({ open }) => (open ? '140vh' : '48px')};

  @media (min-width: ${({ theme }) => theme.breakpoints[0]}) {
    flex-shrink: 0;
    height: 140vh;
  }
`

const Navigation = () => {
  const [open, setOpen] = useState<boolean>(false)

  const toggleMenu = () => setOpen((prev: boolean) => !prev)

  return (
    <StyledNavigation width={['100vw', '304px']} open={open}>
      <Header open={open} toggleMenu={toggleMenu} />
      <Menu open={open} />
    </StyledNavigation>
  )
}

export default Navigation
