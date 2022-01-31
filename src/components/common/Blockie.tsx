import React from 'react'
import makeBlockie from 'ethereum-blockies-base64'
import { Obj } from 'src/shared/types'
import Image from './Image'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

interface BlockieProps extends Obj {
  address?: string
}

const Blockie = ({
  address = ZERO_ADDRESS,
  width = 24,
  ...rest
}: BlockieProps) => (
  <Image
    src={makeBlockie(address || ZERO_ADDRESS)}
    fallback={makeBlockie(address || ZERO_ADDRESS)}
    alt={address}
    width={width}
    {...rest}
  />
)

export default Blockie
