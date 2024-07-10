import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useSelectedVaultLists } from '@generationsoftware/hyperstructure-react-hooks'
import { MODAL_KEYS, useIsModalOpen } from '@shared/generic-react-hooks'
import { VaultInfo } from '@shared/types'
import { getVaultId } from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { useSettingsModalView } from '@hooks/useSettingsModalView'

interface VaultPageVaultListWarningProps {
  vault: Vault
  className?: string
}

export const VaultPageVaultListWarning = (props: VaultPageVaultListWarningProps) => {
  const { vault, className } = props

  const t_vault = useTranslations('Vault')
  const t_settings = useTranslations('Settings')

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

  const { setIsModalOpen: setIsSettingsModalOpen } = useIsModalOpen(MODAL_KEYS.settings)
  const { setView: setSettingsModalView } = useSettingsModalView()

  const onClickManageVaultLists = () => {
    setSettingsModalView('vaultLists')
    setIsSettingsModalOpen(true)
  }

  if (!vault || vaultListEntries.length > 0) {
    return <></>
  }

  return (
    <span
      className={classNames(
        'w-full px-6 py-1 text-center text-sm font-medium bg-pt-warning-light text-pt-warning-dark rounded',
        className
      )}
    >
      {t_vault('shortWarningNotInVaultLists')}{' '}
      <button onClick={onClickManageVaultLists} className='underline'>
        {t_settings('manageVaultLists')}
      </button>
    </span>
  )
}
