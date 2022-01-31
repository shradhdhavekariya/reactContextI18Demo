import React from 'react'
import { Flex } from 'rimble-ui'
import Navigation from 'src/components/common/Navigation'
import Content from './Content'
import Header from './Header'
import Footer from './Navigation/Footer'

interface LayoutProps {
  children?: React.ReactNode
  subheader?: React.ReactNode
  header?: string
  scrollable?: boolean
  headerActions?: React.ReactNode
}

const Layout = ({
  children,
  header,
  subheader,
  scrollable = false,
  headerActions,
}: LayoutProps) => {
  return (
    <Flex
      flexDirection={['column', 'row']}
      position="relative"
      minHeight="100vh"
    >
      <Navigation />
      <Content
        noPadding
        fullScreen={!scrollable}
        mt={['52px', 0]}
        ml={[0, '304px']}
        height="unset"
      >
        {!!header && (
          <Header
            title={header}
            subheader={subheader}
            position="sticky"
            top={scrollable ? ['48px', 0] : 0}
            zIndex={1}
            shadowOnScroll={scrollable}
          >
            {headerActions}
          </Header>
        )}
        {children}
      </Content>
      <Footer />
    </Flex>
  )
}

export default Layout
