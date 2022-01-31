import { LayoutProps, SpaceProps } from 'styled-system'
import { useEffect, useState } from 'react'
import { Image as RimbleImage } from 'rimble-ui'
import styled from 'styled-components'

export interface ImageProps
  extends React.DetailedHTMLProps<
      React.ImgHTMLAttributes<HTMLImageElement>,
      HTMLImageElement
    >,
    Omit<LayoutProps, 'height' | 'width'>,
    SpaceProps {
  fallback: string
  disabled?: boolean
}

const StyledImage = styled(RimbleImage)<ImageProps>`
  ${({ disabled }) => disabled && 'opacity: 0.4; filter: alpha(opacity=40);'}
`

const Image = ({ src, fallback, alt, disabled, ...props }: ImageProps) => {
  const [_src, setSrc] = useState(src)

  const handleOnError = () => {
    setSrc(fallback)
  }

  useEffect(() => {
    setSrc(src)
  }, [src])

  return (
    <StyledImage
      src={_src}
      onError={handleOnError}
      alt={alt}
      disabled={disabled}
      {...props}
    />
  )
}

export default Image
