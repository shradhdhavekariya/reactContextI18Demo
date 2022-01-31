import React from 'react'
import { Box } from 'rimble-ui'
import { LayoutProps, MarginProps } from 'styled-system'

interface ContentProps {
  children?: React.ReactNode
  center?: boolean
  centerV?: boolean
  centerH?: boolean
  noPadding?: boolean
  fullScreen?: boolean
  bg?: string
}
const Content = ({
  children = null,
  center = false,
  centerV = false,
  centerH = false,
  noPadding = false,
  fullScreen = false,
  bg = 'white',
  ...props
}: ContentProps & LayoutProps & MarginProps) => {
  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems={center || centerH ? 'center' : 'flex-start'}
      justifyContent={center || centerV ? 'center' : 'flex-start'}
      p={noPadding ? 0 : [3, 3, '36px']}
      pb={noPadding ? 0 : '26px'}
      flexGrow="1"
      height={fullScreen ? ['unset'] : 'fit-content'}
      overflowY={fullScreen ? 'auto' : 'unset'}
      bg={bg}
      {...props}
    >
      {children}
    </Box>
  )
}

export default Content
