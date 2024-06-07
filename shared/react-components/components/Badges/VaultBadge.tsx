import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useCachedVaultLists,
  useVaultShareData,
  useVaultTokenAddress
} from '@generationsoftware/hyperstructure-react-hooks'
import { VaultList } from '@shared/types'
import { getVaultId, lower, NETWORK } from '@shared/utilities'
import classNames from 'classnames'
import { useMemo } from 'react'
import { TOKEN_LOGO_OVERRIDES } from '../../constants'
import { NetworkIcon } from '../Icons/NetworkIcon'
import { TokenIcon } from '../Icons/TokenIcon'

export interface VaultBadgeProps {
  vault: Vault
  onClick?: () => void
  showSymbol?: boolean
  className?: string
  iconClassName?: string
  nameClassName?: string
  symbolClassName?: string
}

export const VaultBadge = (props: VaultBadgeProps) => {
  const { vault, onClick, showSymbol, className, iconClassName, nameClassName, symbolClassName } =
    props

  const { data: shareData } = useVaultShareData(vault)
  const { data: tokenAddress } = useVaultTokenAddress(vault)

  const { cachedVaultLists } = useCachedVaultLists()

  const vaultInfo = useMemo(() => {
    const vaultLists = Object.values(cachedVaultLists).filter((list) => !!list) as VaultList[]
    const allVaultInfo = vaultLists.map((list) => list.tokens).reduce((a, b) => [...a, ...b], [])
    return allVaultInfo.find((vaultInfo) => getVaultId(vaultInfo) === vault.id)
  }, [vault, cachedVaultLists])

  const isLogoOverridden = !!TOKEN_LOGO_OVERRIDES[vault.chainId as NETWORK]?.[lower(vault.address)]

  return (
    <div
      className={classNames(
        'inline-flex items-center gap-3 shrink-0 px-3 py-2 bg-pt-transparent rounded-lg',
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
              !!vault.logoURI || !!vaultInfo?.logoURI || isLogoOverridden
                ? vault.address
                : vault.tokenAddress ?? tokenAddress,
            logoURI: vault.logoURI ?? vaultInfo?.logoURI ?? vault.tokenLogoURI
          }}
        />
        <NetworkIcon chainId={vault.chainId} className='absolute top-3 left-3 h-4 w-4' />
      </div>
      <div className='flex flex-col'>
        <div className='inline-flex items-center gap-2'>
          <span
            className={classNames(
              'text-sm font-medium overflow-hidden overflow-ellipsis',
              nameClassName
            )}
          >
            {vaultInfo?.name ?? vault.name ?? shareData?.name}
          </span>
          {showSymbol && (
            <span className={classNames('text-xs text-pt-purple-200', symbolClassName)}>
              {vaultInfo?.symbol ?? vault.shareData?.symbol ?? shareData?.symbol}
            </span>
          )}
        </div>
        {!!vaultInfo?.extensions?.yieldSource?.name && (
          <span className='text-xs text-pt-purple-200'>
            {vaultInfo.extensions.yieldSource.name}
          </span>
        )}
      </div>
    </div>
  )
}
