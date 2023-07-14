import {
  useCachedVaultLists,
  useSelectedVaultListIds,
  useVaultList
} from '@pooltogether/hyperstructure-react-hooks'
import { createVaultListToast } from '@shared/react-components'
import { isNewerVersion } from '@shared/utilities'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { DEFAULT_VAULT_LISTS } from '@constants/config'

export const VaultListHandler = () => {
  const router = useRouter()

  const { cachedVaultLists, cache } = useCachedVaultLists()
  const { select } = useSelectedVaultListIds()

  const [urlQueryVaultListSrc, setUrlQueryVaultListSrc] = useState<string>('')

  // Caching & Selecting Imported Vault List
  const {
    isFetching: isImportingVaultList,
    isSuccess: isSuccessVaultList,
    isError: isErrorVaultList
  } = useVaultList(urlQueryVaultListSrc)

  // Handling Default Vault Lists
  useEffect(() => {
    for (const key in DEFAULT_VAULT_LISTS) {
      const defaultVaultList = DEFAULT_VAULT_LISTS[key as keyof typeof DEFAULT_VAULT_LISTS]
      const cachedVaultList = cachedVaultLists[key]
      if (!cachedVaultList || isNewerVersion(defaultVaultList.version, cachedVaultList.version)) {
        cache(key, defaultVaultList)
        select(key, 'local')
      }
    }
  }, [])

  // Validating Vault List Source
  useEffect(() => {
    const vaultListSrc = router.query['list']
    if (!!vaultListSrc && typeof vaultListSrc === 'string') {
      setUrlQueryVaultListSrc(vaultListSrc)
    }
  }, [router.query])

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
      createVaultListToast({ vaultListSrc: urlQueryVaultListSrc, state })
    }
  }, [isImportingVaultList, isSuccessVaultList, isErrorVaultList])

  return <></>
}
