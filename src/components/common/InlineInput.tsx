import { ChangeEvent, useState } from 'react'
import InlineEdit from '@atlaskit/inline-edit'
import TextField from '@atlaskit/textfield'
import { Button, Icon } from 'rimble-ui'

interface InlineInputProps {
  initialValue?: string
  onClick: () => void
  onCancel: () => void
  onConfirm: (value: string) => void
}

const InlineInput = ({
  initialValue = '',
  onClick,
  onCancel,
  onConfirm,
}: InlineInputProps) => {
  const [value, setValue] = useState<string>(initialValue)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: newValue } = e.target
    setValue(newValue)
  }

  return (
    <InlineEdit
      defaultValue={initialValue}
      editView={({ errorMessage, ...fieldProps }) => (
        <TextField
          autoFocus
          {...fieldProps}
          onBlur={onCancel}
          value={value}
          onChange={handleChange}
        />
      )}
      readView={() => (
        <Button
          mainColor="#000000"
          variant="plain"
          height="20px"
          onClick={onClick}
        >
          <Icon name="Edit" color="primary" size="20px" />
        </Button>
      )}
      onCancel={onCancel}
      onConfirm={() => onConfirm(value)}
    />
  )
}

export default InlineInput
