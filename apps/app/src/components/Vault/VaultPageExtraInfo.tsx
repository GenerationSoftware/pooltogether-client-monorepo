import { getBlockExplorerUrl, Vault } from '@pooltogether/hyperstructure-client-js'
import {
  useSelectedVaultLists,
  useVaultShareData,
  useVaultYieldSource
} from '@pooltogether/hyperstructure-react-hooks'
import { AlertIcon } from '@shared/react-components'
import { Button, ExternalLink, LINKS } from '@shared/ui'
import { getVaultId } from '@shared/utilities'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { Address } from 'viem'
import { DEFAULT_VAULT_LISTS } from '@constants/config'

interface VaultPageExtraInfoProps {
  vault: Vault
  className?: string
}

export const VaultPageExtraInfo = (props: VaultPageExtraInfoProps) => {
  const { vault, className } = props

  const t_common = useTranslations('Common')
  const t_vault = useTranslations('Vault')

  const { localVaultLists, importedVaultLists } = useSelectedVaultLists()
  const allVaultLists = { ...localVaultLists, ...importedVaultLists }

  const { data: shareData } = useVaultShareData(vault)

  const { data: yieldSourceAddress } = useVaultYieldSource(vault)

  const contracts: { name: string; address: Address }[] = useMemo(() => {
    const vaultContract = { name: t_vault('vaultContract'), address: vault.address }

    if (!!yieldSourceAddress) {
      const yieldSourceContract = {
        name: t_vault('yieldSourceContract'),
        address: yieldSourceAddress
      }
      return [vaultContract, yieldSourceContract]
    }

    return [vaultContract]
  }, [yieldSourceAddress])

  const vaultLists = useMemo(() => {
    const listsWithVault: { name: string; src: string }[] = []
    const vaultId = getVaultId(vault)

    Object.entries(allVaultLists).forEach(([src, list]) => {
      for (const listVault of list.tokens) {
        if (vaultId === getVaultId(listVault)) {
          const name = list.name
          listsWithVault.push({ name, src })
          break
        }
      }
    })

    return listsWithVault
  }, [vault, allVaultLists])

  if (!!shareData && !!yieldSourceAddress) {
    return (
      <div
        className={classNames(
          'w-full max-w-screen-md flex flex-col gap-4 p-6 text-pt-purple-100 bg-pt-transparent rounded-lg',
          'lg:gap-5 lg:items-center lg:p-10',
          className
        )}
      >
        <div className='flex gap-2 items-center'>
          <AlertIcon className='w-5 h-5' />
          <span className='lg:font-semibold'>
            {t_vault('learnAboutVault', { vaultName: vault.name ?? shareData.name })}
          </span>
        </div>
        <span className='text-sm lg:text-center'>{t_vault('smartContractRisk')}</span>
        <Contracts chainId={vault.chainId} contracts={contracts} />
        {vaultLists.length > 0 ? (
          <>
            <span className='text-sm lg:text-center'>{t_vault('inVaultLists')}</span>
            <VaultLists vaultLists={vaultLists} />
          </>
        ) : (
          <span className='text-sm lg:text-center'>{t_vault('notInVaultLists')}</span>
        )}
        <Button href={LINKS.docs} target='_blank' color='transparent' className='mx-auto'>
          <span className='whitespace-nowrap'>{t_common('readDocs')}</span>
        </Button>
      </div>
    )
  }

  return <></>
}

interface ContractsProps {
  chainId: number
  contracts: { name: string; address: Address }[]
  className?: string
}

const Contracts = (props: ContractsProps) => {
  const { chainId, contracts, className } = props

  return (
    <div className={classNames('flex flex-col lg:flex-row lg:items-center', className)}>
      {contracts.map((contract, i) => {
        return (
          <span
            key={`contractLink-${chainId}-${contract.address}-${i}`}
            className='flex items-center'
          >
            {i !== 0 && <Separator className='hidden lg:block' />}
            <ExternalLink
              href={getBlockExplorerUrl(chainId, contract.address)}
              size='sm'
              className='text-pt-purple-200'
            >
              {contract.name}
            </ExternalLink>
          </span>
        )
      })}
    </div>
  )
}

interface VaultListsProps {
  vaultLists: { name: string; src: string }[]
  className?: string
}

const VaultLists = (props: VaultListsProps) => {
  const { vaultLists, className } = props

  return (
    <div className={classNames('flex flex-col lg:flex-row lg:items-center', className)}>
      {vaultLists.map((list, i) => {
        const isDefaultList = list.src in DEFAULT_VAULT_LISTS

        return (
          <span key={`vaultListLink-${list.src}-${i}`} className='flex items-center'>
            {i !== 0 && <Separator className='hidden lg:block' />}
            <ExternalLink
              key={`vaultListLink-${list.src}-${i}`}
              href={isDefaultList ? `/api/vaultList/${list.src}` : list.src}
              size='sm'
              className='text-pt-purple-200'
            >
              {list.name}
            </ExternalLink>
          </span>
        )
      })}
    </div>
  )
}

const Separator = (props: { className?: string }) => (
  <span className={classNames('mx-2 text-sm', props.className)}>|</span>
)
