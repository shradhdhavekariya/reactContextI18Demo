import { ReactNode } from 'react'
import { Icon, Link, Flex } from 'rimble-ui'
import { useNetworkId } from 'src/shared/web3'
import { generateEtherscanUrl, truncateStringInTheMiddle } from 'src/utils'

interface EtherscanLinkProps {
  type: string
  hash?: string
  label?: ReactNode
}

const EtherscanLink = ({
  type,
  hash,
  label = hash ? truncateStringInTheMiddle(hash) : '',
}: EtherscanLinkProps) => {
  const networkId = useNetworkId()

  return (
    <Link
      href={
        networkId
          ? generateEtherscanUrl({
              type,
              hash,
              chainId: networkId,
            })
          : ''
      }
      target="_blank"
      hoverColor="text-light"
      fontWeight={2}
      fontSize={2}
      color="near-black"
      textOverflow="ellipsis"
    >
      <Flex>
        {label}
        <Icon name="Launch" size="16px" ml={2} />
      </Flex>
    </Link>
  )
}

export default EtherscanLink
