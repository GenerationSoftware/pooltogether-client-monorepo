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
            base: 'block w-full border-r-8 border-transparent outline outline-1 hover:bg-pt-transparent disabled:cursor-not-allowed disabled:opacity-50',
            sizes: {
              sm: 'px-2 py-[11.5px] sm:text-xs',
              md: 'px-2.5 py-[11.5px] text-sm',
              lg: 'sm:text-md px-4 py-[11.5px]'
            },
            colors: {
              custom:
                'bg-pt-bg-purple-dark text-pt-purple-100 outline-pt-purple-100 focus:ring-2 focus:ring-pt-purple-50'
            }
          }
        }
      }}
      color='custom'
      shadow={false}
      className={classNames('max-w-[12.5rem]', className)}
    >
      <option value='all' className='bg-pt-bg-purple-dark'>
        {t('allVaultLists')}
      </option>
      {Object.entries({ ...localVaultLists, ...importedVaultLists }).map(([id, list]) => (
        <option key={id} value={id} className='bg-pt-bg-purple-dark'>
          {list.name}
        </option>
      ))}
    </Select>
  )
}
