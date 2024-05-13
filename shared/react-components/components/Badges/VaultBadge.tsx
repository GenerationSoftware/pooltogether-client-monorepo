import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useVaultShareData,
  useVaultTokenAddress
} from '@generationsoftware/hyperstructure-react-hooks'
import { lower, NETWORK } from '@shared/utilities'
import classNames from 'classnames'
import { TOKEN_LOGO_OVERRIDES } from '../../constants'
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

  const isLogoOverridden = !!TOKEN_LOGO_OVERRIDES[vault.chainId as NETWORK]?.[lower(vault.address)]

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
            ...shareData,
            ...vault,
            address:
              !!vault.logoURI || isLogoOverridden
                ? vault.address
                : vault.tokenAddress ?? tokenAddress,
            logoURI: vault.logoURI ?? vault.tokenLogoURI
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
        {vault.name ?? shareData?.name}
      </span>
      <span className={classNames('text-xs text-pt-purple-200', symbolClassName)}>
        {vault.shareData?.symbol ?? shareData?.symbol}
      </span>
    </div>
  )
}
