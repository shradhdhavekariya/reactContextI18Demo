import React from 'react'
import { ReactComponent as YesIcon } from 'src/assets/icons/YesLogo.svg'
import { ReactComponent as YotiIcon } from 'src/assets/icons/YotiLogo.svg'
import DocScanLogo from 'src/assets/images/DocScan.png'

interface VendorIconProps {
  vendor: string
}

const VendorIcon = ({ vendor }: VendorIconProps) => {
  switch (vendor) {
    case 'yes':
      return <YesIcon width="200px" />
    case 'yoti':
      return <YotiIcon width="200px" />
    case 'docScan':
      return <img src={DocScanLogo} width="66" alt="docscan" />
    default:
      return <></>
  }
}

export default VendorIcon
