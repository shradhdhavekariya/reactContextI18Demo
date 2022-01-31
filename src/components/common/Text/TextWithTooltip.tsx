import React, { ComponentType } from 'react'
import { Flex, Tooltip, Icon } from 'rimble-ui'

type WrapperType = string | ComponentType

type TextWithTooltipProps = {
  children: React.ReactNode
  icon?: string
  iconSize?: string
  tooltip: string
  wrapper?: WrapperType
  [k: string]: unknown
}

const TextWithTooltip = ({
  children,
  icon = 'Help',
  iconSize = '16px',
  tooltip,
  wrapper = Flex,
  ...props
}: TextWithTooltipProps) => {
  const Tag = wrapper

  return (
    <Tag {...props}>
      {children}
      <Tooltip placement="top" message={tooltip}>
        {icon && (
          <Icon
            size={iconSize}
            name={icon}
            ml={1}
            mt={-1}
            style={{ cursor: 'pointer' }}
          />
        )}
      </Tooltip>
    </Tag>
  )
}

export default TextWithTooltip
