import React from 'react'
import styled from 'styled-components'
import { Box, Link, Flex } from 'rimble-ui'
import SwarmLogoMobile from 'src/assets/icons/SwarmLogoMobile.svg'
import SwarmLogoDesktop from 'src/assets/icons/SwarmLogoDesktop.svg'
import { ReactComponent as WalletIcon } from 'src/assets/icons/Wallet.svg'
import useNetlify from 'src/hooks/useNetlify'
import config from 'src/environment'
import NetworkSelect from '../NetworkSelect'

// eslint-disable-next-line
const StyledBurger = styled.button<any>`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 27px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;
  height: fit-content;

  span {
    width: 100%;
    height: 3px;
    margin-top: 4.5px;
    background-color: #ffffff;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 3px;
    :first-child {
      transform: ${({ open }) => (open ? 'rotate(45deg)' : 'rotate(0)')};
      margin-top: 0;
    }
    :nth-child(2) {
      opacity: ${({ open }) => (open ? '0' : '1')};
      transform: ${({ open }) => (open ? 'translateX(20px)' : 'translateX(0)')};
    }
    :nth-child(3) {
      transform: ${({ open }) => (open ? 'rotate(-45deg)' : 'rotate(0)')};
    }
  }

  @media (min-width: ${({ theme }) => theme.breakpoints[0]}) {
    display: none;
  }
`

const StyledHeader = styled(Box)`
  background-color: ${({ theme }) => theme.colors['navy-dark']};
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`

const CornerTag = styled.span`
  position: absolute;
  top: 0;
  right: 50%;
  border: 10px solid transparent;
  border-top: 10px solid white;
`

const Avatar = styled.div`
  width: 43px;
  height: 32px;
  background-size: cover;
  background: url(${SwarmLogoMobile}) center no-repeat;

  @media (min-width: ${({ theme }) => theme.breakpoints[0]}) {
    width: 180px;
    height: 38px;
    background-image: url(${SwarmLogoDesktop});
  }
`

interface HeaderProps {
  open: boolean
  toggleMenu?: () => void
}

const Header = ({ open, toggleMenu }: HeaderProps) => {
  const { isBranchActive, toggleBranch } = useNetlify(config.secretBranch)

  return (
    <StyledHeader px={[3, '28px']} py={[2, '28px']}>
      {isBranchActive && <CornerTag />}
      <Avatar onDoubleClick={toggleBranch} />
      <Flex alignItems="center">
        <Box mr="12px" display={['block', 'none']}>
          <NetworkSelect />
        </Box>
        <Link href="/wallet" display={['block', 'none']}>
          <WalletIcon height="28px" style={{ marginRight: '12px' }} />
        </Link>
        <StyledBurger
          aria-label="Toggle menu"
          aria-expanded={open}
          open={open}
          onClick={toggleMenu}
        >
          <span />
          <span />
          <span />
        </StyledBurger>
      </Flex>
    </StyledHeader>
  )
}

export default Header
