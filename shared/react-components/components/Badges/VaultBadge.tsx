import { Vault } from '@pooltogether/hyperstructure-client-js'
import classNames from 'classnames'
import { NetworkIcon } from '../Icons/NetworkIcon'
import { TokenIcon } from '../Icons/TokenIcon'

export interface VaultBadgeProps {
  vault: Vault
  className?: string
  iconClassName?: string
  nameClassName?: string
  symbolClassName?: string
  onClick?: () => void
}

export const VaultBadge = (props: VaultBadgeProps) => {
  const { vault, className, iconClassName, nameClassName, symbolClassName, onClick } = props

  return (
    <div
      className={classNames(
        'inline-flex items-center gap-2 shrink-0 px-3 py-2 bg-pt-transparent rounded-lg',
        'whitespace-nowrap overflow-hidden',
        'border border-pt-transparent',
        { 'cursor-pointer select-none hover:bg-pt-purple-50/20': !!onClick },
        className
      )}
      onClick={onClick}
    >
      <div className={classNames('relative pb-1 shrink-0', iconClassName)}>
        <TokenIcon
          token={{
            chainId: vault.chainId,
            address: vault.address,
            name: vault.name,
            logoURI: vault.logoURI
          }}
        />
        <NetworkIcon chainId={vault.chainId} className='absolute top-3 left-3 h-4 w-4' />
      </div>
      <span
        className={classNames(
          'text-sm font-medium overflow-hidden overflow-ellipsis',
          nameClassName
        )}
      >
        {vault.name}
      </span>
      <span className={classNames('text-xs text-pt-purple-200', symbolClassName)}>
        {vault.shareData?.symbol}
      </span>
    </div>
  )
}
