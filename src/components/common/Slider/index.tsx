import React, { FormEvent, useMemo } from 'react'
import {
  Slider as MuiSlider,
  SliderProps as MuiSliderProps,
  Theme,
  withStyles,
} from '@material-ui/core'
import { range } from 'lodash'
import { Color } from 'src/theme'
import Thumb from './Thumb'

interface SliderProps extends Omit<MuiSliderProps, 'color' | 'onChange'> {
  variant?: keyof typeof Color
  onChange?: (newValue: number) => void
}

interface StyledSliderProps extends Omit<MuiSliderProps, 'color'> {
  variant?: keyof typeof Color
}

const getColor = (
  theme: Theme,
  variant: 'main' | 'dark' | 'light' = 'main',
) => ({ variant: color }: StyledSliderProps) =>
  color
    ? theme.palette.augmentColor({ main: Color[color] })[variant]
    : theme.palette.primary[variant]

const StyledSlider = withStyles<string, never, StyledSliderProps>((theme) => ({
  root: {
    color: getColor(theme),
  },
  active: {},
  rail: {
    height: 4,
    backgroundColor: '#cccccc',
    opacity: 'unset',
  },
  track: {
    height: 4,
    backgroundColor: getColor(theme),
  },
  thumb: {
    height: 20,
    width: 20,
    backgroundColor: '#ffffff',
    top: '50%',
    transform: 'translate(-25%, -50%)',
    marginTop: 1,
    border: '1px solid #cccccc',
    '&:hover, &:active': {
      backgroundColor: getColor(theme, 'dark'),
      boxShadow: 'none',
    },
    '&:focus': {
      boxShadow: 'none',
    },
    disabled: {
      height: 20,
      width: 20,
    },
  },
  disabled: {
    '&$thumb': {
      height: 20,
      width: 20,
      top: '50%',
      transform: 'translate(-25%, -50%)',
      marginTop: 1,
      backgroundColor: getColor(theme, 'light')({ variant: 'grey' }),
    },
  },
}))(MuiSlider)

const Slider = ({
  variant: color = 'primary',
  onChange,
  ...props
}: SliderProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOnChange: any = (
    event: FormEvent<HTMLSpanElement>,
    newValue: number | number[],
  ) => {
    if (onChange && typeof newValue === 'number') {
      onChange?.(newValue)
    }
  }

  const { min = 0, max = Number.MAX_SAFE_INTEGER } = props

  const step = (max - min) / 4

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const marks = useMemo(
    () => range(min, max + step, step).map((mark) => ({ value: mark })),
    [min, max, step],
  )

  return (
    <StyledSlider
      ThumbComponent={Thumb}
      variant={color}
      onChange={handleOnChange}
      {...props}
    />
  )
}

export default Slider
