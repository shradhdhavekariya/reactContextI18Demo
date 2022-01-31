import { utils } from 'ethers'

const requireFile = require.context('./', true, /[\w-]+\.json$/)

type ABINames =
  | 'BPool'
  | 'BPoolProxy'
  | 'ERC20'
  | 'VSMTToken'
  | 'XToken'
  | 'XTokenWrapper'
  | 'BRegistry'
  | 'ProtocolFee'
  | 'SmtPriceFeed'
  | 'SmtDistributor'
  | 'ActionManager'

export default Object.fromEntries(
  requireFile
    .keys()
    .map((fileName) => [
      fileName.replace('./', '').replace('.json', ''),
      requireFile(fileName),
    ]),
) as Record<ABINames, utils.Fragment[]>
