import { ReactNode } from 'react'

export type Intl<T = any> = (key: T, data?: { [id: string]: number | string }) => string

export interface RichIntl<T = any> extends Intl<T> {
  rich: (key: T, data: { [id: string]: (chunks: ReactNode) => ReactNode }) => ReactNode
}
