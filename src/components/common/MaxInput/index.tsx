import {
  ChangeEvent,
  HTMLAttributes,
  ReactNode,
  useEffect,
  useState,
} from 'react'
import { Flex, Button } from 'rimble-ui'
import styled from 'styled-components'
import { MarginProps } from 'styled-system'
import { ExtractProps } from 'src/shared/types/props'
import toFixed from 'src/shared/utils/math/toFixed'

const StyledWrapper = styled(Flex)`
  border: 1px solid ${({ theme }) => theme.colors.grey};
  border-radius: ${({ theme }) => theme.borderWidths[3]};
  height: ${({ height }) => height || '36px'};
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes[2]}px;
  box-shadow: 0px 2px 4px rgb(0 0 0 / 10%);
  max-width: 100%;
  padding: 0 8px;

  &:hover {
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.3);
  }

  &:focus-within {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  & > input {
    height: ${({ height }) => height || '36px'};
    border: none;
    background: none;
    border-radius: ${({ theme }) => theme.borderWidths[3]};
    text-align: right;
    font-weight: ${({ theme }) => theme.fontWeights[5]};
    font-size: ${({ theme }) => theme.fontSizes[2]}px;
    flex-grow: 1;
    min-width: 0;
    -moz-appearance: textfield;
    outline: none;
    width: 100%;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  & > button {
    height: ${({ height }) => height || '36px'};
    font-weight: ${({ theme }) => theme.fontWeights[5]};
    padding: 0;
    font-size: ${({ theme }) => theme.fontSizes[2]}px;
  }

  @media (max-width: ${({ theme }) => theme?.breakpoints[0]}) {
    height: 36px;
  }
`

const NumberRegex = /^(\d+\.?\d*)?$/
const DecimalPointNumberRegex = /^\d+\.((\d*)(0+))?$/

interface MaxInputProps extends ExtractProps<typeof Flex>, MarginProps {
  value?: number
  onChange?: (value: number) => void
  endAdornment?: ReactNode
  max?: number
  min?: number
  inputProps?: HTMLAttributes<HTMLInputElement>
  doNotValidate?: boolean
  disabled?: boolean
  showMax?: boolean
}

const MaxInput = ({
  onChange,
  value = 0,
  endAdornment,
  max = Number.MAX_SAFE_INTEGER,
  min = 0,
  doNotValidate = false,
  inputProps,
  disabled = false,
  showMax = true,
  ...props
}: MaxInputProps) => {
  const [localValue, setLocalValue] = useState<string>(value.toString())

  useEffect(() => {
    setLocalValue(value.toString())
  }, [value])

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: newValue } = e.target

    const numberValue = Number(newValue)

    if (Number.isNaN(numberValue)) {
      return
    }

    if (['', '0'].includes(newValue)) {
      setLocalValue(newValue)
    }

    if (DecimalPointNumberRegex.test(newValue)) {
      setLocalValue(newValue)
    } else if (onChange && NumberRegex.test(newValue)) {
      if (doNotValidate || (numberValue >= min && numberValue <= max)) {
        setLocalValue(Number(newValue).toString())
        onChange(Number(newValue))
      }
    }
  }

  const handleOnFocus = () => {
    if (value === 0) {
      setLocalValue('')
    }
  }

  const handleOnBlur = () => {
    if (Number(localValue) !== value) {
      onChange?.(Number(localValue))
    } else {
      setLocalValue(toFixed(value).toString())
    }
  }

  const handleMaxClick = () => {
    onChange?.(max)
  }

  return (
    <StyledWrapper {...props}>
      {showMax && (
        <Button.Text onClick={handleMaxClick} disabled={disabled}>
          MAX
        </Button.Text>
      )}
      <input
        type="text"
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        onChange={handleOnChange}
        value={localValue}
        disabled={disabled}
      />
      {endAdornment}
    </StyledWrapper>
  )
}

export default MaxInput
