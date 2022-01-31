export enum AlertVariant {
  default = 'default',
  success = 'success',
  error = 'error',
  warning = 'warning',
}

export interface AlertOptions {
  secondaryMessage?: string
  actionHref?: string
  actionText?: React.ReactNode
  actionHrefOpenInSameTab?: boolean
  variant?: AlertVariant
  icon?: string
  autoDismissible?: boolean | number
  key?: string
}
export type AlertSkeleton = AlertOptions & {
  message: React.ReactNode
  key?: string
}

export type Alert = AlertSkeleton & {
  key: number
  closing?: boolean
}
