import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useVaultShareData,
  useVaultTokenAddress
} from '@generationsoftware/hyperstructure-react-hooks'
import { TokenWithLogo } from '@shared/types'
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

  const { data: shareData } = useVaultShareData(vault)
  const { data: tokenAddress } = useVaultTokenAddress(vault)

  const token: Partial<TokenWithLogo> = {
    chainId: vault.chainId,
    address: !!vault.logoURI ? vault.address : vault.tokenAddress ?? tokenAddress,
    name: vault.name ?? shareData?.name,
    symbol: vault.shareData?.symbol ?? shareData?.symbol,
    logoURI: vault.logoURI ?? vault.tokenLogoURI
  }

  const TagView = () => {
    if (vault.tags && vault.tags.length > 0) {
      return <span className='gap-1'> - {vault.tags.join(',')}</span>
    }
  }

  return (
    <div
      className={classNames(
        'inline-flex items-center gap-2 shrink-0 px-3 py-2 w-full bg-pt-transparent rounded-lg',
        'whitespace-nowrap overflow-hidden',
        'border border-pt-transparent',
        { 'cursor-pointer select-none hover:bg-pt-purple-50/20': !!onClick },
        className
      )}
      onClick={onClick}
    >
      <div>
        <div className={classNames('relative shrink-0', iconClassName)}>
          <TokenIcon token={token} />
          <NetworkIcon chainId={vault.chainId} className='absolute top-3 left-3 h-4 w-4' />
        </div>
      </div>

      <div className='flex flex-col'>
        <span
          className={classNames(
            'text-sm font-medium overflow-hidden overflow-ellipsis',
            nameClassName
          )}
        >
          {token.name}
        </span>
        <span className={classNames('text-xs text-pt-purple-200', symbolClassName)}>
          {token.symbol}
          <TagView />
        </span>
      </div>
    </div>
  )
}
