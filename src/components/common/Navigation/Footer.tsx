import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Button, Box, Flex, Icon, Link, Text, Tooltip } from 'rimble-ui'
import { PowerSettingsNew } from '@rimble/icons'
import { networkMap } from 'src/consts'
import { generateEtherscanUrl, truncateStringInTheMiddle } from 'src/utils'
import VerifyAddressButton from 'src/components/common/Buttons/VerifyAddressButton'
import config from 'src/environment'
import { useIsLoggedIn, useUserAddresses } from 'src/state/hooks'
import equals from 'src/shared/utils/string/equals'
import { useAccount, useNetworkId } from 'src/shared/web3'
import { AlertVariant } from '../Snackbar/types'
import { useSnackbar } from '../Snackbar'
import ConnectionSwitch from '../ConnnectionSwitch'
import ConnectWalletButton from '../Buttons/ConnectWalletButton'

const { docs, socials } = config.resources

const StyledFooter = styled(Flex)`
  position: sticky;
  background-color: ${({ theme }) => theme.colors['navy-dark']};
  justify-content: space-between;

  @media (min-width: ${({ theme }) => theme.breakpoints?.[0]}) {
    position: fixed;
    bottom: 0;
    flex-shrink: 0;
    z-index: ${({ theme }) => theme.zIndices?.[4]};
  }
`

const StyledIconButton = styled(Button.Text)`
  min-width: 0;
  padding: 0;

  svg {
    height: 14px;
    width: auto;
  }
`

const Footer = () => {
  const { t } = useTranslation(['navigation', 'passport'])
  const account = useAccount()
  const networkId = useNetworkId()
  const userAddresses = useUserAddresses()
  const isLoggedIn = useIsLoggedIn()

  const { addAlert } = useSnackbar()
  const connectedAddress = useMemo(
    () => userAddresses?.find((address) => equals(address, account)) || '',
    [account, userAddresses],
  )

  const handleCopyClick = async () => {
    await navigator.clipboard.writeText(connectedAddress)
    addAlert(
      t('passport:general.copiedToClipboard', {
        address: truncateStringInTheMiddle(connectedAddress),
      }),
      {
        variant: AlertVariant.success,
        autoDismissible: true,
      },
    )
  }

  const handleSwitchAuth = (login: () => void, logout: () => void) => (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    event.stopPropagation()
    if (checked) {
      login()
    } else {
      logout()
    }
  }

  return (
    <StyledFooter
      px={[3, '24px']}
      py={[2, '24px']}
      flexDirection={['row', 'column']}
      alignItems={['center', 'flex-start']}
      width={['100vw', '304px']}
      position="sticky"
      bottom={0}
    >
      <Flex>
        {networkId && (
          <Tooltip
            message={t('footer.connectionTooltip', {
              name: networkMap[networkId],
            })}
          >
            <Flex alignItems="center">
              <Icon
                name="Lens"
                size="8px"
                color={account ? 'success' : 'danger'}
                mr={1}
              />
              <Text color="white" fontWeight={5} fontSize={0}>
                {networkMap[networkId]}
              </Text>
            </Flex>
          </Tooltip>
        )}
        <Box display={['none', 'block']}>
          <Link
            href={docs.general}
            target="_blank"
            color="white"
            fontWeight={5}
            fontSize={0}
            lineHeight="copy"
            ml="24px"
          >
            {t('footer.docs')}
          </Link>
          <Link
            href={socials.github}
            target="_blank"
            color="white"
            fontWeight={5}
            fontSize={0}
            lineHeight="copy"
            ml="24px"
          >
            Github
          </Link>
        </Box>
      </Flex>
      <Flex
        mt={[0, 1]}
        ml={0}
        flexDirection="row"
        width="100%"
        justifyContent={['flex-end', 'flex-start']}
        overflow="hidden"
        alignItems="center"
        height="18px"
      >
        {connectedAddress ? (
          <>
            <Tooltip message={connectedAddress}>
              <Link
                href={
                  networkId
                    ? generateEtherscanUrl({
                        type: 'address',
                        hash: connectedAddress,
                        chainId: networkId,
                      })
                    : ''
                }
                target="_blank"
                color="white"
                fontWeight={2}
                fontSize={0}
                flexShrink="0"
              >
                {truncateStringInTheMiddle(connectedAddress)}
              </Link>
            </Tooltip>
            <StyledIconButton
              iconOnly
              icon="ContentCopy"
              size="small"
              mainColor="white"
              onClick={handleCopyClick}
              title={t('passport:myAddresses.copy')}
              ml={2}
            />
          </>
        ) : (
          <Text color="white" fontWeight={2} fontSize={0} flexShrink="0">
            {t('passport:myAddresses.noAddressConnected')}
          </Text>
        )}
        <VerifyAddressButton
          render={(verify) => (
            <ConnectWalletButton
              onNext={verify}
              render={(open, logout) => (
                <ConnectionSwitch
                  checked={isLoggedIn && !!account}
                  title={t(
                    `footer.${isLoggedIn ? 'connected' : 'disconnected'}`,
                  )}
                  icon={<PowerSettingsNew size={14} color="white" />}
                  onChange={handleSwitchAuth(account ? verify : open, logout)}
                />
              )}
            />
          )}
        />
      </Flex>
    </StyledFooter>
  )
}

export default Footer
