import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useCachedVaultLists,
  useVaultShareData,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { ImportedVaultTooltip, PrizePoolBadge, TokenIcon } from '@shared/react-components'
import { getVaultId } from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useMemo } from 'react'
import { useVaultImportedListSrcs } from '@hooks/useVaultImportedListSrcs'

interface VaultPageHeaderProps {
  vault?: Vault
  className?: string
}

export const VaultPageHeader = (props: VaultPageHeaderProps) => {
  const { vault, className } = props

  const t_common = useTranslations('Common')
  const t_tooltips = useTranslations('Tooltips')

  const { data: share } = useVaultShareData(vault as Vault)
  const { data: token } = useVaultTokenData(vault as Vault)

  const { cachedVaultLists } = useCachedVaultLists()

  const logoURI = useMemo(() => {
    if (!!vault) {
      const defaultVaults = cachedVaultLists['default']?.tokens ?? []
      const cachedLogoURI = defaultVaults.find((v) => getVaultId(v) === vault.id)?.logoURI
      return vault.logoURI ?? cachedLogoURI
    }
  }, [vault, cachedVaultLists])

  const importedSrcs = useVaultImportedListSrcs(vault as Vault)

  return (
    <>
      <div className={classNames('w-full flex flex-col gap-2 items-center', className)}>
        <div className='w-full flex relative justify-center items-center'>
          <BackButton />
          {!!vault && (
            <div className='w-full max-w-[85%] inline-flex justify-center gap-2 items-center md:max-w-none'>
              {(!!logoURI || !!token?.address) && (
                <TokenIcon
                  token={{
                    chainId: vault.chainId,
                    address: !!logoURI ? vault.address : token?.address,
                    name: !!logoURI ? vault.name : token?.name,
                    logoURI: logoURI ?? vault.tokenLogoURI,
                    symbol: !!logoURI ? share?.symbol : token?.symbol
                  }}
                  className='h-6 w-6 md:h-8 md:w-8'
                />
              )}
              <span
                className={classNames(
                  'text-[1.75rem] font-medium font-grotesk line-clamp-2 overflow-hidden overflow-ellipsis',
                  'md:max-w-[65%] md:text-4xl',
                  { 'text-center': !logoURI }
                )}
              >
                {vault.name ?? share?.name}
              </span>
              {importedSrcs.length > 0 && (
                <ImportedVaultTooltip
                  vaultLists={importedSrcs}
                  intl={t_tooltips('importedVault')}
                />
              )}
            </div>
          )}
        </div>
        {!!vault && (!!vault.name || !!share?.name) && (
          <Link href={`/prizes?network=${vault.chainId}`}>
            <PrizePoolBadge chainId={vault.chainId} onClick={() => {}} intl={t_common} />
          </Link>
        )}
      </div>
    </>
  )
}

const BackButton = () => {
  const t = useTranslations('Common')

  return (
    <Link
      href='/vaults'
      className='absolute left-0 flex items-center gap-2 text-pt-purple-100 cursor-pointer'
    >
      <ArrowLeftIcon className='h-6 w-6 md:h-4 md:w-4' />
      <span className='hidden text-xs font-medium md:block'>{t('back')}</span>
    </Link>
  )
}
