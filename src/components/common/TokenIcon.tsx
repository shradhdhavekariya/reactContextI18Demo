import Image, { ImageProps } from 'src/components/common/Image'
import { useRequestCache } from 'src/cache/request-cache'
import wethIconSrc from 'src/assets/icons/Weth.svg'
import vsmtIconSrc from 'src/assets/icons/vSMT.svg'
import smtIconSrc from 'src/assets/icons/SMT.svg'
import sptIconSrc from 'src/assets/icons/SPT.svg'
import config from 'src/environment'
import { propEquals } from 'src/shared/utils/collection/filters'
import { useMemo } from 'react'

const SWARM_TOKENS = ['smt', 'vsmt', 'spt', 'xspt', 'weth']
const SWARM_ICONS = {
  smt: smtIconSrc,
  vsmt: vsmtIconSrc,
  spt: sptIconSrc,
  xspt: sptIconSrc,
  weth: wethIconSrc,
}

const { iconsCdn: iconsBaseUrl } = config.resources

const genericIconSrc = `${iconsBaseUrl}/svg/color/generic.svg`

interface TokenIconProps extends Omit<ImageProps, 'fallback'> {
  symbol?: string
  name?: string
}

const TokenIcon = ({
  symbol = 'generic',
  name,
  disabled = false,
  ...props
}: TokenIconProps) => {
  const { value: manifest } = useRequestCache(`${iconsBaseUrl}/manifest.json`)

  const iconAvailable = manifest?.find?.(propEquals('symbol', symbol))

  const iconSrc = useMemo(() => {
    if (SWARM_TOKENS.includes(symbol.toLowerCase())) {
      return SWARM_ICONS[symbol.toLowerCase() as keyof typeof SWARM_ICONS]
    }
    if (iconAvailable) {
      return `${iconsBaseUrl}/svg/color/${symbol.toLowerCase()}.svg`
    }

    return genericIconSrc
  }, [iconAvailable, symbol])

  return (
    <Image
      src={iconSrc}
      fallback={genericIconSrc}
      alt={name || symbol}
      title={name || symbol}
      disabled={disabled}
      {...props}
    />
  )
}

export default TokenIcon
