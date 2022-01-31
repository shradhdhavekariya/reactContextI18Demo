import React from 'react'
import styled from 'styled-components'
import { Box, Icon, Text, Link, Button } from 'rimble-ui'
import match from 'conditional-expression'
import { ReactComponent as SuccessIcon } from 'src/assets/icons/Success.svg'
import { ReactComponent as ErrorIcon } from 'src/assets/icons/Error.svg'
import { ReactComponent as WarningIcon } from 'src/assets/icons/Warning.svg'
import { AlertSkeleton, AlertVariant } from './types'

const StyledLink = styled(Link)`
  text-transform: uppercase;

  & {
    text-decoration: none !important;
    cursor: pointer;
  }
  &:hover {
    text-decoration: none;
  }
  &:active {
    text-decoration: none;
  }
`

const StyledTextCell = styled(Box)`
  & {
    text-align: justify;
  }
`

const StyledToastMessage = styled(Box)`
  & {
    pointer-events: all;
    user-select: none;
    overflow: hidden;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    min-height: 56px;
    height: auto;
    width: 100%;
    max-width: 520px;
    padding: ${({ theme }) => theme.space[3]}px 1rem;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
    transition: all 0.15s ease;
  }
  &:hover {
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.15);
  }

  > .iconBox {
    display: block;
    height: 24px;
  }

  > .actionLink {
    text-decoration: none;
  }

  > .closeBttn {
    outline: none;
  }

  > ${StyledTextCell} > div {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media screen and (max-width: 420px) {
    border-color: transparent;
  }

  @media screen and (min-width: 420px) {
    & {
      border-radius: 4px;
      padding: ${(props) => (props.closeElem ? '0 0 0 1rem' : '0 1rem')};
    }
  }
`

export type ToastMessageProps = AlertSkeleton & {
  onClose?: () => void
  className?: string
}

const AlertIcon = ({ variant }: { variant: AlertVariant }) =>
  match(variant)
    .equals('warning')
    .then(<WarningIcon />)
    .equals('success')
    .then(<SuccessIcon />)
    .equals('error')
    .then(<ErrorIcon />)
    .else('')

const ToastMessage = (props: ToastMessageProps) => {
  const {
    message,
    secondaryMessage = '',
    actionHref = '',
    actionText = '',
    actionHrefOpenInSameTab = false,
    variant = 'default',
    onClose,
  } = props

  return (
    <StyledToastMessage
      bg="black"
      border={1}
      borderColor="transparent"
      {...props}
    >
      {variant !== 'default' && (
        <Box className="iconBox" flex="0 0">
          <AlertIcon variant={variant} />
        </Box>
      )}
      <StyledTextCell flex="1 1 auto" m={2} minWidth="1px">
        {message && (
          <Text
            fontSize={1}
            fontWeight={3}
            color="white"
            style={{ whiteSpace: 'pre-line' }}
          >
            {message}
          </Text>
        )}
        {secondaryMessage && (
          <Text fontSize={1} color="#afafaf">
            {secondaryMessage}
          </Text>
        )}
      </StyledTextCell>
      <Text flex="1" mr={2} textAlign="right" lineHeight="24px">
        {actionText && actionHref && (
          <StyledLink
            className="actionLink"
            href={actionHref}
            target={actionHrefOpenInSameTab ? '_self' : '_blank'}
            color="#389CFE"
            hoverColor="#389CFE"
            fontWeight="700"
          >
            {actionText}
          </StyledLink>
        )}
      </Text>
      <Button.Text
        onClick={onClose}
        size="small"
        icononly
        className="closeBttn"
      >
        <Icon name="Close" size="20px" color="white" />
      </Button.Text>
    </StyledToastMessage>
  )
}

ToastMessage.displayName = 'ToastMessage'

export default ToastMessage
