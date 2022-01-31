import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

interface RouterLinkProps {
  pathname: string
  queryParams?: string[][] | Record<string, string> | string | URLSearchParams
  hash?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state?: any
  children: React.ReactNode
}

export const StyledRouterLink = styled(Link)`
  text-decoration: none;
  &:visited {
    color: ${({ theme }) => theme.colors['primary-dark']};
  }
`

export const RouterLink = ({
  pathname,
  queryParams,
  hash,
  state,
  children,
}: RouterLinkProps) => {
  const search = useMemo(() => `?${new URLSearchParams(queryParams)}`, [
    queryParams,
  ])

  return (
    <StyledRouterLink to={{ pathname, search, hash, state }}>
      {children}
    </StyledRouterLink>
  )
}
