import {
  useCachedVaultLists,
  useSelectedVaultListIds,
  useVaultList
} from '@generationsoftware/hyperstructure-react-hooks'
import { createVaultListToast } from '@shared/react-components'
import { isNewerVersion } from '@shared/utilities'
import * as fathom from 'fathom-client'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DEFAULT_VAULT_LISTS, FATHOM_EVENTS } from '@constants/config'

export const VaultListHandler = () => {
  const searchParams = useSearchParams()

  const t = useTranslations('Toasts.vaultListImports')

  const { cachedVaultLists, cache } = useCachedVaultLists()
  const { select } = useSelectedVaultListIds()

  const [urlQueryVaultListSrc, setUrlQueryVaultListSrc] = useState<string>('')

  // Caching & Selecting Imported Vault List
  const {
    isFetching: isImportingVaultList,
    isSuccess: isSuccessVaultList,
    isError: isErrorVaultList
  } = useVaultList(urlQueryVaultListSrc, {
    onSuccess: () => fathom.trackEvent(FATHOM_EVENTS.importedVaultList)
  })

  // Handling Default Vault Lists
  useEffect(() => {
    for (const key in DEFAULT_VAULT_LISTS) {
      const defaultVaultList = DEFAULT_VAULT_LISTS[key as keyof typeof DEFAULT_VAULT_LISTS]
      const cachedVaultList = cachedVaultLists[key]

      if (!cachedVaultList || isNewerVersion(defaultVaultList.version, cachedVaultList.version)) {
        cache(key, defaultVaultList)

        if (key === 'default') {
          select(key, 'local')
        }
      }
    }
  }, [])

  // Validating Vault List Source
  useEffect(() => {
    const vaultListSrc = searchParams?.get('list')

    if (!!vaultListSrc && typeof vaultListSrc === 'string') {
      const isLocalVaultList = Object.keys(DEFAULT_VAULT_LISTS).includes(vaultListSrc.toLowerCase())

      if (isLocalVaultList) {
        select(vaultListSrc.toLowerCase(), 'local')
      } else {
        setUrlQueryVaultListSrc(vaultListSrc.trim())
      }
    }
  }, [searchParams])

  // Displaying Vault List Toast
  useEffect(() => {
    const state = isSuccessVaultList
      ? 'success'
      : isErrorVaultList
      ? 'error'
      : isImportingVaultList
      ? 'importing'
      : undefined

    if (!!state) {
      createVaultListToast({ vaultListSrc: urlQueryVaultListSrc, state, intl: t })
    }
  }, [isImportingVaultList, isSuccessVaultList, isErrorVaultList])

  if (isImportingVaultList) {
    return <div className='fixed inset-0 backdrop-brightness-75 z-50' />
  }

  return <></>
}
