import { ReactNode } from 'react'

export * from './pool'
export * from './swap-pair'
export * from './swap-tx-settings'
export * from './toggle-button-option'

// Make some properties in T required
export type RequiredProps<T, P extends keyof T> = T & Required<Pick<T, P>>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Obj = Record<string, any>

export interface ChildrenProps {
  children: ReactNode
}
