import { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Box, Button, Link } from 'rimble-ui'
import { Icon } from '@rimble/icons'
import { NavLink } from 'react-router-dom'
import Translate from 'src/components/common/Translate'
import { ReactComponent as TwitterIcon } from 'src/assets/icons/Twitter.svg'
import { ReactComponent as DiscordIcon } from 'src/assets/icons/Discord.svg'
import { ReactComponent as WalletIcon } from 'src/assets/icons/Wallet.svg'
import { ReactComponent as PoolIcon } from 'src/assets/icons/Pool.svg'
import { ReactComponent as PassportIcon } from 'src/assets/icons/Passport.svg'
import config from 'src/environment'

const { resources, isProduction } = config
const {
  docs: { gettingStarted },
  origin,
  socials,
} = resources

const StyledMenu = styled(Box)`
  background-color: ${({ theme }) => theme.colors['navy-dark']};
  flex-grow: 1;
  transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(-100%)')};
  transition: transform 0.3s ease-in-out;
  overflow: auto;
  max-height: 100vh;

  @media (min-width: ${({ theme }) => theme.breakpoints[0]}) {
    transform: none;
    transition: none;
    overflow-y: unset;
  }
  z-index: ${({ theme }) => theme.zIndices[2]};
`
const StyledNav = styled.nav`
  padding: 55px 28px;

  @media (min-width: ${({ theme }) => theme.breakpoints[0]}) {
    padding: 36px;
  }
`

const StyledLink = styled(NavLink)`
  text-decoration: none !important;
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  font-size: ${({ theme }) => theme.fontSizes[3]}px;
  margin-bottom: 36px;
  align-items: center;
  opacity: 0.5;

  &:hover,
  &:active,
  &:focus,
  &.active {
    opacity: 1;
    color: ${({ theme }) => theme.colors.white};
  }
`

const ShowMoreButton = styled(Button.Text)`
  text-decoration: none !important;
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: ${({ theme }) => theme.fontSizes[3]}px;
  margin-bottom: 36px;
  align-items: center;
  opacity: ${({ active }) => (active ? 1 : 0.5)};
  padding: 0;
  height: 32px;
  width: 100%;

  &:hover,
  &:active,
  &:focus,
  &.active {
    opacity: 1;
  }

  span {
    align-items: center;
  }
`

const StyledExternalLink = styled(Link)`
  text-decoration: none !important;
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  font-size: ${({ theme }) => theme.fontSizes[3]}px;
  margin-bottom: 36px;
  align-items: center;
  opacity: 0.5;
  padding-left: 52px;

  &:hover,
  &:active,
  &:focus,
  &.active {
    opacity: 1;
    color: ${({ theme }) => theme.colors.white};
  }
`

const SocialWrapper = styled(Box)`
  margin-bottom: 36px;
  & > a {
    opacity: 0.5;

    &:hover {
      cursor: pointer;
      opacity: 1;
    }
  }
`

interface MenuProps {
  open: boolean
}

const Menu = ({ open }: MenuProps) => {
  const [showMoreActive, setShowMoreActive] = useState<boolean>(false)

  const toggleShowMore = useCallback(() => {
    setShowMoreActive((prev: boolean) => !prev)
  }, [setShowMoreActive])

  return (
    <StyledMenu open={open}>
      <StyledNav>
        <StyledLink to="/swap">
          <Icon size="32px" mr="20px" name="SwapHoriz" color="white" />
          <Translate namespaces={['navigation']}>menu.swap</Translate>
        </StyledLink>
        <StyledLink to="/pools">
          <PoolIcon width="32px" style={{ marginRight: '20px' }} />
          <Translate namespaces={['navigation']}>menu.pools</Translate>
        </StyledLink>
        <StyledLink to="/wallet">
          <WalletIcon width="32px" style={{ marginRight: '20px' }} />
          <Translate namespaces={['navigation']}>menu.wallet</Translate>
        </StyledLink>
        <StyledLink to="/passport">
          <PassportIcon width="32px" style={{ marginRight: '20px' }} />
          <Translate namespaces={['navigation']}>menu.passport</Translate>
        </StyledLink>

        <ShowMoreButton onClick={toggleShowMore} active={showMoreActive}>
          <Icon size="32px" mr="20px" name="MoreHoriz" color="white" />
          <Translate namespaces={['navigation']}>menu.more</Translate>
        </ShowMoreButton>
        {showMoreActive && (
          <>
            <StyledExternalLink href={origin} target="_blank">
              <Translate namespaces={['navigation']}>menu.about</Translate>
            </StyledExternalLink>
            <StyledExternalLink href={gettingStarted.faq} target="_blank">
              <Translate namespaces={['navigation']}>menu.faq</Translate>
            </StyledExternalLink>
            {!isProduction() && (
              <StyledLink to="/faucet">
                <Box ml="52px" />
                Testnet Faucet
              </StyledLink>
            )}
            <SocialWrapper ml="52px">
              <Link href={socials.twitter} target="_blank">
                <TwitterIcon width="32px" />
              </Link>
              <Link href={socials.discord} target="_blank">
                <DiscordIcon width="32px" style={{ marginLeft: '33px' }} />
              </Link>
            </SocialWrapper>
          </>
        )}
      </StyledNav>
    </StyledMenu>
  )
}

export default Menu
