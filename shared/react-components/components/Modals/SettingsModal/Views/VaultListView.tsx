import {
  useCachedVaultLists,
  useSelectedVaultListIds
} from '@generationsoftware/hyperstructure-react-hooks'
import { TrashIcon } from '@heroicons/react/24/outline'
import { VaultList } from '@shared/types'
import { Intl } from '@shared/types'
import { BasicIcon, Button, ExternalLink, Spinner, Toggle } from '@shared/ui'
import { getVaultList, LINKS, NETWORK } from '@shared/utilities'
import classNames from 'classnames'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { usePublicClient } from 'wagmi'
import { ImportedBadge } from '../../../Badges/ImportedBadge'

interface VaultListViewProps {
  localVaultLists: { [id: string]: VaultList }
  onSuccess?: (id: string) => void
  intl?: {
    base?: Intl<
      | 'manageVaultLists'
      | 'vaultListsDescription'
      | 'learnMoreVaultLists'
      | 'urlInput'
      | 'addVaultList'
      | 'clearImportedVaultLists'
      | 'numTokens'
      | 'imported'
    >
    errors?: Intl<'formErrors.invalidSrc' | 'formErrors.invalidVaultList'>
  }
}

export const VaultListView = (props: VaultListViewProps) => {
  const { localVaultLists, onSuccess, intl } = props

  const { cachedVaultLists, remove } = useCachedVaultLists()

  const { localIds, importedIds, unselect } = useSelectedVaultListIds()

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
    <div className='flex flex-col gap-4 md:gap-8'>
      <Header intl={intl?.base} />

      <ImportVaultListForm onSuccess={onSuccess} intl={intl} />

      {Object.keys(localVaultLists).map((id) => (
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
        <ClearImportedVaultListsButton onClick={handleClearAll} intl={intl?.base} />
      )}
    </div>
  )
}

interface HeaderProps {
  intl?: Intl<'manageVaultLists' | 'vaultListsDescription' | 'learnMoreVaultLists'>
}

const Header = (props: HeaderProps) => {
  const { intl } = props

  return (
    <div className='flex flex-col items-center gap-2 text-center'>
      <span className='text-lg font-semibold md:text-xl'>
        {intl?.('manageVaultLists') ?? 'Manage Vault Lists'}
      </span>
      <span className='text-sm text-pt-purple-50 md:text-base'>
        {intl?.('vaultListsDescription') ??
          'Vault lists determine what prize vaults are displayed throughout the app. Use caution when interacting with imported lists.'}
      </span>
      <ExternalLink href={LINKS.listDocs} className='text-pt-purple-200'>
        {intl?.('learnMoreVaultLists') ?? 'Learn more about vault lists'}
      </ExternalLink>
    </div>
  )
}

interface ImportVaultListFormProps {
  onSuccess?: (id: string) => void
  intl?: {
    base?: Intl<'urlInput' | 'addVaultList'>
    errors?: Intl<'formErrors.invalidSrc' | 'formErrors.invalidVaultList'>
  }
}

const ImportVaultListForm = (props: ImportVaultListFormProps) => {
  const { onSuccess, intl } = props

  const mainnetPublicClient = usePublicClient({ chainId: NETWORK.mainnet })

  const { cache } = useCachedVaultLists()
  const { select } = useSelectedVaultListIds()

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
      const cleanSrc = data.src.trim()
      const vaultList = await getVaultList(cleanSrc, mainnetPublicClient)

      if (!!vaultList) {
        cache(cleanSrc, vaultList)
        select(cleanSrc, 'imported')
        onSuccess?.(cleanSrc)
        reset()
      } else {
        setError('src', {
          message: intl?.errors?.('formErrors.invalidVaultList') ?? 'No valid vault list found'
        })
      }
    } catch (err) {
      setError('src', {
        message: intl?.errors?.('formErrors.invalidVaultList') ?? 'No valid vault list found'
      })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2 mt-4 md:mt-0'>
      <div className='inline-flex flex-col gap-x-4 gap-y-2 sm:flex-row'>
        <input
          {...register('src', {
            validate: {
              isValidSrc: (v) =>
                v.startsWith('http://') ||
                v.startsWith('https://') ||
                v.startsWith('ipfs://') ||
                v.startsWith('ipns://') ||
                v.endsWith('.eth') ||
                (intl?.errors?.('formErrors.invalidSrc') ?? 'Not a valid URL or ENS domain')
            }
          })}
          id='vaultListInput'
          type='text'
          className={classNames(
            'w-full text-sm bg-gray-50 text-pt-purple-900 px-4 py-3 rounded-lg focus:outline-none',
            { 'brightness-75': isImporting }
          )}
          placeholder={intl?.base?.('urlInput') ?? 'https:// or ipfs:// or ENS name'}
          disabled={isImporting}
        />
        <Button
          type='submit'
          color='purple'
          className='relative bg-pt-purple-600 border-pt-purple-600 hover:bg-pt-purple-500 focus:outline-transparent'
          disabled={isImporting}
        >
          <span
            className={classNames('py-[1px] text-pt-purple-50 whitespace-nowrap', {
              'opacity-0': isImporting
            })}
          >
            {intl?.base?.('addVaultList') ?? 'Add Vault List'}
          </span>
          {isImporting && <Spinner className='absolute left-0 right-0 mx-auto' />}
        </Button>
      </div>
      {!!error && <span className='text-sm text-pt-warning-light'>{error}</span>}
    </form>
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

interface ClearImportedVaultListsButtonProps {
  onClick: () => void
  intl?: Intl<'clearImportedVaultLists'>
}

const ClearImportedVaultListsButton = (props: ClearImportedVaultListsButtonProps) => {
  const { onClick, intl } = props

  return (
    <span
      onClick={onClick}
      className='w-full text-center text-sm text-pt-purple-200 cursor-pointer'
    >
      {intl?.('clearImportedVaultLists') ?? 'Clear all imported vault lists'}
    </span>
  )
}
