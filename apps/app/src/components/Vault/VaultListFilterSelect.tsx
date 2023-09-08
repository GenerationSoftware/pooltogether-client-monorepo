import { useSelectedVaultLists } from '@generationsoftware/hyperstructure-react-hooks'
import classNames from 'classnames'
import { Select } from 'flowbite-react'
import { useAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { vaultListFilterIdAtom } from './VaultFilters'

interface VaultListFilterSelectProps {
  className?: string
}

export const VaultListFilterSelect = (props: VaultListFilterSelectProps) => {
  const { className } = props

  const t = useTranslations('Vaults.filters')

  const { localVaultLists, importedVaultLists } = useSelectedVaultLists()

  const [vaultListId, setVaultListId] = useAtom(vaultListFilterIdAtom)

  return (
    <Select
      value={vaultListId}
      onChange={(e) => setVaultListId(e.target.value)}
      theme={{
        field: {
          base: 'relative w-full',
          select: {
            colors: {
              custom:
                'bg-pt-bg-purple-dark text-pt-purple-100 border-pt-purple-100 focus:ring-2 focus:ring-pt-purple-50'
            }
          }
        }
      }}
      color='custom'
      shadow={false}
      className={classNames('max-w-[12.5rem]', className)}
    >
      <option value='all'>{t('allVaultLists')}</option>
      {Object.entries({ ...localVaultLists, ...importedVaultLists }).map(([id, list]) => (
        <option value={id}>{list.name}</option>
      ))}
    </Select>
  )
}
