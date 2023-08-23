import { TrashIcon } from '@heroicons/react/24/outline'
import {
  useCachedVaultLists,
  useSelectedVaultListIds
} from '@pooltogether/hyperstructure-react-hooks'
import { VaultList } from '@shared/types'
import { Intl } from '@shared/types'
import { BasicIcon, ExternalLink, Toggle } from '@shared/ui'
import { getVaultList, NETWORK } from '@shared/utilities'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { usePublicClient } from 'wagmi'
import { ImportedBadge } from '../../../Badges/ImportedBadge'

interface VaultListViewProps {
  localVaultLists?: { [id: string]: VaultList }
  intl?: {
    base?: Intl<
      | 'manageVaultLists'
      | 'vaultListsDescription'
      | 'learnMoreVaultLists'
      | 'urlInput'
      | 'clearImportedVaultLists'
      | 'numTokens'
      | 'imported'
    >
    forms?: Intl<'invalidSrc' | 'invalidVaultList'>
  }
}

export const VaultListView = (props: VaultListViewProps) => {
  const { localVaultLists, intl } = props

  const mainnetPublicClient = usePublicClient({ chainId: NETWORK.mainnet })

  const { cachedVaultLists, cache, remove } = useCachedVaultLists()

  const { localIds, importedIds, select, unselect } = useSelectedVaultListIds()

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { errors }
  } = useForm<{ src: string }>({
    mode: 'onSubmit',
    defaultValues: { src: '' }
  })

  const [isImporting, setIsImporting] = useState<boolean>(false)

  const error =
    !!errors.src?.message && typeof errors.src?.message === 'string' ? errors.src?.message : null

  const onSubmit = async (data: { src: string }) => {
    setIsImporting(true)
    clearErrors('src')

    try {
      const vaultList = await getVaultList(data.src, mainnetPublicClient)

      if (!!vaultList) {
        cache(data.src, vaultList)
        select(data.src, 'imported')
        reset()
      } else {
        setError('src', {
          message: intl?.forms?.('invalidVaultList') ?? 'No valid vault list found'
        })
      }
    } catch (err) {
      setError('src', {
        message: intl?.forms?.('invalidVaultList') ?? 'No valid vault list found'
      })
    } finally {
      setIsImporting(false)
    }
  }

  const importedVaultLists = useMemo(() => {
    const localVaultListIds = Object.keys(localVaultLists ?? {})
    const newVaultLists: { [id: string]: VaultList } = {}
    Object.keys(cachedVaultLists).forEach((key) => {
      if (!localVaultListIds.includes(key) && !!cachedVaultLists[key]) {
        newVaultLists[key] = cachedVaultLists[key] as VaultList
      }
    })
    return newVaultLists
  }, [localVaultLists, cachedVaultLists])

  const handleClearAll = () => {
    const ids = Object.keys(importedVaultLists)
    ids.forEach((id) => {
      unselect(id, 'imported')
      remove(id)
    })
  }

  return (
    <div className='flex flex-col gap-4 px-4 md:gap-8'>
      <div className='flex flex-col items-center gap-2 text-center'>
        <span className='text-lg font-semibold md:text-xl'>
          {intl?.base?.('manageVaultLists') ?? 'Manage Vault Lists'}
        </span>
        <span className='text-sm text-pt-purple-50 md:text-base'>
          {intl?.base?.('vaultListsDescription') ??
            'Vault lists determine what prize vaults are displayed throughout the app. Use caution when interacting with imported lists.'}
        </span>
        {/* TODO: add link */}
        <ExternalLink
          href='#'
          text={intl?.base?.('learnMoreVaultLists') ?? 'Learn more about vault lists'}
          className='text-pt-purple-200'
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='mt-4 md:mt-0'>
        <input
          {...register('src', {
            validate: {
              isValidSrc: (v) =>
                v.startsWith('http://') ||
                v.startsWith('https://') ||
                v.startsWith('ipfs://') ||
                v.startsWith('ipns://') ||
                v.endsWith('.eth') ||
                (intl?.forms?.('invalidSrc') ?? 'Not a valid URL or ENS domain')
            }
          })}
          id='vaultListInput'
          type='text'
          className='w-full text-sm bg-gray-50 text-pt-purple-900 px-4 py-3 rounded-lg focus:outline-none'
          placeholder={intl?.base?.('urlInput') ?? 'https:// or ipfs:// or ENS name'}
          disabled={isImporting}
        />
        {!!error && <span className='text-sm text-pt-warning-light'>{error}</span>}
      </form>

      {!!localVaultLists &&
        Object.keys(localVaultLists).map((id) => (
          <VaultListItem
            key={`vl-local-item-${id}`}
            id={id}
            vaultList={localVaultLists[id]}
            isChecked={localIds.includes(id)}
            intl={intl?.base}
          />
        ))}

      {Object.keys(importedVaultLists).map((id) => (
        <VaultListItem
          key={`vl-imported-item-${id}`}
          id={id}
          vaultList={importedVaultLists[id]}
          isChecked={importedIds.includes(id)}
          isImported={true}
          intl={intl?.base}
        />
      ))}

      {Object.keys(importedVaultLists).length > 0 && (
        <span
          onClick={handleClearAll}
          className='w-full text-center text-sm text-pt-purple-200 cursor-pointer'
        >
          {intl?.base?.('clearImportedVaultLists') ?? 'Clear all imported vault lists'}
        </span>
      )}
    </div>
  )
}

interface VaultListItemProps {
  id: string
  vaultList: VaultList
  isChecked?: boolean
  isImported?: boolean
  intl?: Intl<'numTokens' | 'imported'>
}

const VaultListItem = (props: VaultListItemProps) => {
  const { vaultList, id, isChecked, isImported, intl } = props

  const { remove } = useCachedVaultLists()

  const { select, unselect } = useSelectedVaultListIds()

  const handleChange = (checked: boolean) => {
    if (checked) {
      select(id, isImported ? 'imported' : 'local')
    } else {
      unselect(id, isImported ? 'imported' : 'local')
    }
  }

  const handleDelete = () => {
    unselect(id, isImported ? 'imported' : 'local')
    remove(id)
  }

  const version = `v${vaultList.version.major}.${vaultList.version.minor}.${vaultList.version.patch}`

  return (
    <div className='w-full flex items-center justify-between gap-2'>
      <div className='flex items-center gap-2'>
        {!!vaultList.logoURI ? (
          <img src={vaultList.logoURI} className='w-8 h-8 rounded-full' />
        ) : (
          <BasicIcon content='?' size='lg' />
        )}
        <div className='flex flex-col gap-1 text-pt-purple-50'>
          <span>
            <span className='text-sm md:text-base md:font-medium'>{vaultList.name}</span>{' '}
            <span className='text-xs'>{version}</span>
          </span>
          <div className='flex items-center gap-2 text-pt-purple-100'>
            <span className='text-xs'>
              {intl?.('numTokens', { number: vaultList.tokens.length }) ??
                `${vaultList.tokens.length} Token${vaultList.tokens.length > 1 ? 's' : ''}`}
            </span>
            {isImported && <ImportedBadge intl={{ text: intl?.('imported') }} />}
          </div>
        </div>
      </div>
      <div className='flex items-center gap-2'>
        {isImported && (
          <TrashIcon onClick={handleDelete} className='h-5 w-5 text-pt-purple-200 cursor-pointer' />
        )}
        <Toggle checked={!!isChecked} onChange={handleChange} />
      </div>
    </div>
  )
}
