import { useRef, useEffect, useCallback, forwardRef } from 'react'
import styled from 'styled-components'
import { Input } from 'rimble-ui'
import { ExtractProps } from 'src/shared/types/props'
import useCombinedRefs from 'src/shared/hooks/useCombinedRefs'

interface StyledInputProps {
  error?: string
}

const StyledInput = styled<StyledInputProps & ExtractProps<typeof Input>>(
  Input,
)`
  ${({ error, theme }) =>
    error &&
    `
    border-color: ${theme.colors.danger};

    &:focus {
      border-color: ${theme.colors.danger};
    }
  `}
`

const CustomInput = forwardRef<
  HTMLInputElement,
  StyledInputProps & ExtractProps<typeof Input>
>((props: StyledInputProps & ExtractProps<typeof Input>, forwardedRef) => {
  const { error, value, onFocus } = props
  const innerRef = useRef(null)

  const ref = useCombinedRefs<HTMLInputElement>(innerRef, forwardedRef)

  useEffect(() => {
    ref.current?.setCustomValidity(error ?? '')
  }, [error, ref])

  const handleOnFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (error && ref.current?.validity.customError) {
        ref.current?.reportValidity()
      }
      onFocus?.(e)
    },
    [error, onFocus, ref],
  )

  useEffect(() => {
    if (
      error &&
      ref.current?.validity.customError &&
      ref.current === document.activeElement
    ) {
      ref.current?.reportValidity()
    }
  }, [error, ref, value])

  return <StyledInput {...props} ref={ref} onFocus={handleOnFocus} />
})

CustomInput.displayName = 'CustomInput'

export default CustomInput
