import React, { forwardRef } from 'react'
import { Box, Heading, Text, Flex } from 'rimble-ui'
import useHasScrolled from 'src/hooks/useHasScrolled'
import styled from 'styled-components'
import { PositionProps } from 'styled-system'

interface HeaderProps {
  title: React.ReactNode
  legend?: React.ReactNode
  subheader?: React.ReactNode
  children?: React.ReactNode
  shadowOnScroll?: boolean
}

const Wrapper = styled(Box)`
  transition: box-shadow 500ms;
`

const Header = forwardRef(
  (
    {
      title,
      legend,
      subheader,
      children,
      shadowOnScroll,
      ...props
    }: HeaderProps & PositionProps,
    ref,
  ) => {
    const shadow = useHasScrolled({ active: shadowOnScroll })

    return (
      <Wrapper
        width="100%"
        bg="white"
        display="flex"
        flexDirection={['column', 'row']}
        justifyContent="space-between"
        p={[3, 3, 4]}
        {...props}
        ref={ref}
        boxShadow={shadow && `0px 8px 16px rgba(0, 0, 0, 0.15)`}
      >
        <Box width="100%">
          <Flex justifyContent="space-between" flexWrap="wrap">
            <Heading
              as="h2"
              fontWeight={5}
              fontSize={5}
              lineHeight="40px"
              color="text"
              my="0"
              maxWidth="676px"
              textAlign="left"
            >
              {title}
            </Heading>
            {children && (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
              >
                {children}
              </Box>
            )}
          </Flex>
          {legend && (
            <Text.p color="grey" fontWeight={5} mt="14px" mb="0">
              {legend}
            </Text.p>
          )}
          {!!subheader && <Box color="grey">{subheader}</Box>}
        </Box>
      </Wrapper>
    )
  },
)

Header.displayName = 'Header'

export default Header
