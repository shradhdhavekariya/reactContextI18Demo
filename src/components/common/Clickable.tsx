import { ReactNode } from 'react'
import styled from 'styled-components'
import {
  space,
  width,
  fontSize,
  color,
  flexbox,
  border,
  margin,
  background,
  SpaceProps,
  FontSizeProps,
  ColorProps,
  FlexboxProps,
  WidthProps,
  BorderProps,
  MarginProps,
  BackgroundProps,
} from 'styled-system'

export type ClickableProps = SpaceProps &
  WidthProps &
  FontSizeProps &
  FlexboxProps &
  BorderProps &
  MarginProps &
  Omit<ColorProps, 'color'> &
  BackgroundProps & {
    children: ReactNode
  }

const Clickable = styled.button<ClickableProps>`
  background: none;
  display: flex;
  border: none;
  padding: 0;
  outline: none;
  cursor: ${(props) => (props.onClick ? 'pointer' : 'default')};
  text-align: left;

  &:hover {
    background: rgba(200, 200, 200, 0.2);
  }

  ${space}
  ${width}
  ${fontSize}
  ${color}
  ${flexbox}
  ${border}
  ${margin}
  ${background}
`

export default Clickable
