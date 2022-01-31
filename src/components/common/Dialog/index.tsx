import { pick } from 'lodash'
import React, { useCallback, useState } from 'react'
import { Box, Button, Card, Flex, Heading } from 'rimble-ui'
import {
  flexboxProps,
  layoutProps,
  spaceProps,
} from 'src/shared/consts/style-system'
import { ExtractProps } from 'src/shared/types/props'
import styled from 'styled-components'
import {
  BorderRadiusProps,
  flexbox,
  FlexboxProps,
  layout,
  LayoutProps,
  space,
  SpaceProps,
} from 'styled-system'
import Portal from '../Portal'

const StyledOverlay = styled(Box)`
  & {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9999;
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-flow: column;
    place-items: center;
    place-content: center;
    padding: ${({ theme }) => theme.space[3]}px;
    ${flexbox}
    ${layout}
    ${space}

    transition: all .25s;
  }
`

StyledOverlay.defaultProps = {
  bg: 'blacks.10',
}

const modalOverlayClass = 'modal-overlay'

interface DialogProps {
  isOpen?: boolean
  onClose?: () => void
  title?: React.ReactNode
  titleProps?: ExtractProps<typeof Heading>
  children: React.ReactNode
}

const Dialog = ({
  isOpen = false,
  onClose,
  title,
  children,
  titleProps,
  borderRadius = 1,
  ...rest
}: DialogProps &
  LayoutProps &
  FlexboxProps &
  SpaceProps &
  BorderRadiusProps) => {
  const pickedLayoutProps = pick(rest, layoutProps)
  const pickedFlexboxProps = pick(rest, flexboxProps)
  const pickedSpaceProps = pick(rest, spaceProps)
  const [closeOnClickAway, setCloseOnClickAway] = useState(true)

  const handleAwayClick = useCallback(
    (e: React.BaseSyntheticEvent<HTMLDivElement>) => {
      e.stopPropagation()
      if (closeOnClickAway && e.target.classList.contains(modalOverlayClass))
        onClose?.()
    },
    [closeOnClickAway, onClose],
  )

  const handleMouseDown = useCallback(
    (e: React.BaseSyntheticEvent<HTMLDivElement>) => {
      setCloseOnClickAway(e.target.classList.contains(modalOverlayClass))
    },
    [],
  )

  if (!isOpen) {
    return null
  }

  return (
    <Portal lockScroll>
      <StyledOverlay
        onClick={handleAwayClick}
        onMouseDown={handleMouseDown}
        className={modalOverlayClass}
        isOpen={isOpen}
        pb={[0, 3]}
        px={[0, 3]}
        justifyContent={['flex-end', 'center']}
      >
        <Card
          position="relative"
          display="flex"
          flexDirection="column"
          justifyContent="stretch"
          borderTopLeftRadius={[3, borderRadius]}
          borderTopRightRadius={[3, borderRadius]}
          borderBottomLeftRadius={[0, borderRadius]}
          borderBottomRightRadius={[0, borderRadius]}
          width={['100%', 'auto']}
          maxWidth="100%"
          maxHeight="100%"
          p={3}
          {...pickedLayoutProps}
          {...pickedSpaceProps}
          {...rest}
        >
          {onClose && (
            <Button.Text
              icononly
              bg="transparent"
              mainColor="grey"
              icon="Close"
              position="absolute"
              right="4px"
              top="14px"
              height="28px"
              onClick={onClose}
              zIndex={50}
              boxShadow={0}
            />
          )}
          {!!title && (
            <Heading as="h4" fontSize={4} fontWeight={5} mt={0} {...titleProps}>
              {title}
            </Heading>
          )}
          <Flex
            flexDirection="column"
            height="100%"
            width="100%"
            overflow="hidden"
          >
            <Flex
              flexDirection="column"
              height="100%"
              width="100%"
              overflowY="auto"
              p={3}
              {...pickedFlexboxProps}
            >
              {children}
            </Flex>
          </Flex>
        </Card>
      </StyledOverlay>
    </Portal>
  )
}

export default Dialog
