import { PoolToken } from 'src/shared/types/tokens'
import styled from 'styled-components'
import TokenIcon from '../common/TokenIcon'

interface AssetIconsProps {
  assets: PoolToken[]
}

const AssetIconsWrapper = styled.div`
  display: flex;
  position: relative;
  flex-wrap: wrap;
`

const AssetWrapper = styled.div`
  width: 16px;
  flex: 0 1 0;
`

const AssetIcons = ({ assets }: AssetIconsProps) => {
  return (
    <AssetIconsWrapper>
      {assets.map((asset) => (
        <AssetWrapper key={asset.address}>
          <TokenIcon
            width="20px"
            height="20px"
            symbol={asset.symbol}
            name={asset.name}
            maxWidth="none"
          />
        </AssetWrapper>
      ))}
    </AssetIconsWrapper>
  )
}

export default AssetIcons
