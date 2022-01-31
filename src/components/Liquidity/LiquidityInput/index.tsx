import React, { HTMLAttributes } from 'react'
import { LayoutProps } from 'styled-system'
import { Flex } from 'rimble-ui'
import MaxInput from 'src/components/common/MaxInput'
import Slider from 'src/components/common/Slider'

interface LiquidityInputProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>,
    LayoutProps {
  value?: number
  max?: number
  min?: number
  sliderOptions?: { step?: number; variant?: 'primary' | 'danger' }
  endAdornment?: React.ReactNode
  onChange?: (value: number) => void
  disabled?: boolean
}

const LiquidityInput = ({
  value = 0,
  max,
  min,
  onChange,
  endAdornment,
  sliderOptions = { step: 1, variant: 'primary' },
  disabled = false,
  ...props
}: LiquidityInputProps) => (
  <Flex
    flexDirection="column"
    mt="24px"
    px={3}
    flex="0 1 auto"
    alignItems="center"
    {...props}
  >
    <MaxInput
      mb={1}
      endAdornment={endAdornment}
      onChange={onChange}
      value={value}
      max={max}
      min={min}
      disabled={disabled}
      doNotValidate
    />
    <Slider
      max={max}
      min={min}
      value={value}
      onChange={onChange}
      step={sliderOptions?.step}
      variant={sliderOptions?.variant}
      disabled={disabled}
    />
  </Flex>
)

export default LiquidityInput
