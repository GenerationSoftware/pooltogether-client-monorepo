import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useSelectedVaults } from '@generationsoftware/hyperstructure-react-hooks'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { ImportedVaultTooltip, VaultBadge } from '@shared/react-components'
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

  const t_tooltips = useTranslations('Tooltips')

  const { vaults } = useSelectedVaults()

  const logoURI = useMemo(() => {
    if (!!vault) {
      return vault.logoURI ?? vaults.allVaultInfo.find((v) => getVaultId(v) === vault.id)?.logoURI
    }
  }, [vault, vaults])

  const importedSrcs = useVaultImportedListSrcs(vault!)

  return (
    <div className={classNames('w-full flex flex-col gap-2 items-center', className)}>
      <div className='w-full flex relative justify-center items-center'>
        <BackButton />
        {!!vault && (
          <div className='w-full max-w-[85%] inline-flex justify-center gap-3 items-center md:max-w-none'>
            <VaultBadge
              vault={vault}
              className='!p-0 bg-transparent border-none'
              iconClassName='md:h-8 md:w-8'
              networkIconClassName='md:top-5 md:left-5'
              nameClassName={classNames(
                'mb-1 !text-[1.75rem] leading-8 font-medium font-grotesk line-clamp-2 md:!text-4xl',
                { 'text-center': !logoURI }
              )}
              yieldSourceClassName='hidden'
            />
            {importedSrcs.length > 0 && (
              <ImportedVaultTooltip
                vaultLists={importedSrcs}
                placement='bottom'
                intl={t_tooltips('importedVault')}
              />
            )}
          </div>
        )}
      </div>
    </div>
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
