import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useCachedVaultLists,
  useSelectedVaultListIds,
  useSelectedVaultLists,
  useVaultShareData,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { MODAL_KEYS, useIsModalOpen } from '@shared/generic-react-hooks'
import { VaultInfo } from '@shared/types'
import { getFormattedVaultList, getVaultId } from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useSettingsModalView } from '@hooks/useSettingsModalView'

interface VaultPageVaultListWarningProps {
  vault: Vault
  className?: string
}

export const VaultPageVaultListWarning = (props: VaultPageVaultListWarningProps) => {
  const { vault, className } = props

  const t_vault = useTranslations('Vault')
  const t_settings = useTranslations('Settings')

  const { address: userAddress } = useAccount()

  const { data: share } = useVaultShareData(vault)
  const { data: token } = useVaultTokenData(vault)

  const { localVaultLists, importedVaultLists } = useSelectedVaultLists()
  const allVaultLists = Object.values({ ...localVaultLists, ...importedVaultLists })

  const vaultListEntries = useMemo(() => {
    const entries: VaultInfo[] = []

    if (!!vault) {
      allVaultLists.forEach((list) => {
        for (const entry of list.tokens) {
          if (vault.id === getVaultId(entry)) {
            entries.push(entry)
          }
        }
      })
    }

    return entries
  }, [vault, allVaultLists])

  const { cache } = useCachedVaultLists()
  const { select } = useSelectedVaultListIds()

  const { setIsModalOpen: setIsSettingsModalOpen } = useIsModalOpen(MODAL_KEYS.settings)
  const { setView: setSettingsModalView } = useSettingsModalView()

  if (!vault || vaultListEntries.length > 0) {
    return <></>
  }

  const onClickAddToPersonalVaultList = () => {
    const tokens = importedVaultLists['personal']?.tokens ?? []

    const existingVaultIds = tokens.map((token) => getVaultId(token))
    if (!existingVaultIds.includes(vault.id)) {
      tokens.push({ chainId: vault.chainId, address: vault.address })
    }

    const personalVaultList = getFormattedVaultList({
      name: 'Personal Vault List',
      tokens,
      keywords: ['pooltogether', 'cabana', 'personal'],
      logoURI: !!userAddress ? `https://effigy.im/a/${userAddress}.png` : undefined,
      shareData: !!share ? { [vault.id]: share } : undefined,
      tokenData: !!token ? { [vault.id]: token } : undefined
    })

    cache('personal', personalVaultList)
    select('personal', 'imported')
  }

  const onClickManageVaultLists = () => {
    setSettingsModalView('vaultLists')
    setIsSettingsModalOpen(true)
  }

  const buttonClassName = 'underline hover:text-[hsl(0,100%,15%)]'

  return (
    <span
      className={classNames(
        'w-full flex flex-col items-center px-6 py-1 text-center text-sm font-medium bg-pt-warning-light text-pt-warning-dark rounded',
        'md:flex-row md:justify-between',
        className
      )}
    >
      <span className='font-semibold'>{t_vault('shortWarningNotInVaultLists')}</span>
      <div className='flex flex-col md:items-end'>
        <button onClick={onClickAddToPersonalVaultList} className={buttonClassName}>
          {t_vault('addToPersonalVaultList')}
        </button>
        <button onClick={onClickManageVaultLists} className={buttonClassName}>
          {t_settings('manageVaultLists')}
        </button>
      </div>
    </span>
  )
}
