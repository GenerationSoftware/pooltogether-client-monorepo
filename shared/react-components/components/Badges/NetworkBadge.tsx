import { getNiceNetworkNameByChainId } from '@pooltogether/hyperstructure-client-js'
import classNames from 'classnames'
import { NetworkIcon } from '../Icons/NetworkIcon'

export interface NetworkBadgeProps {
  chainId: number
  appendText?: string
  hideIcon?: boolean
  hideBorder?: boolean
  hideBg?: boolean
  className?: string
  iconClassName?: string
  textClassName?: string
  onClick?: () => void
}

export const NetworkBadge = (props: NetworkBadgeProps) => {
  const {
    chainId,
    appendText,
    hideIcon,
    hideBorder,
    hideBg,
    className,
    iconClassName,
    textClassName,
    onClick
  } = props

  const networkName = getNiceNetworkNameByChainId(chainId)

  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1 px-3 py-2 text-sm rounded-lg',
        {
          'border border-pt-transparent': !hideBorder && !hideBg,
          'bg-pt-transparent': !hideBg,
          'cursor-pointer select-none hover:bg-pt-purple-50/20': !!onClick
        },
        className
      )}
      onClick={onClick}
    >
      {!hideIcon && (
        <NetworkIcon chainId={chainId} className={classNames('h-4 w-4 shrink-0', iconClassName)} />
      )}
      <span className={classNames(textClassName)}>
        {networkName}
        {!!appendText ? ` ${appendText}` : ''}
      </span>
    </span>
  )
}
