import { Intl } from '@shared/types'
import { getNiceNetworkNameByChainId } from '@shared/utilities'
import classNames from 'classnames'
import { NetworkIcon } from '../Icons/NetworkIcon'
import { NetworkBadgeProps } from './NetworkBadge'

export interface PrizePoolBadgeProps extends Omit<NetworkBadgeProps, 'appendText'> {
  intl?: Intl<'prizePool'>
}

export const PrizePoolBadge = (props: PrizePoolBadgeProps) => {
  const {
    chainId,
    hideIcon,
    hideBorder,
    hideBg,
    className,
    iconClassName,
    textClassName,
    onClick,
    intl
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
        {intl?.('prizePool', { network: networkName }) ?? `${networkName} Prize Pool`}
      </span>
    </span>
  )
}
