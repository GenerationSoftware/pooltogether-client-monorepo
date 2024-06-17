import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  usePublicClientsByChain,
  useSelectedVaults,
  useVaultTokenAddress
} from '@generationsoftware/hyperstructure-react-hooks'
import { ErrorPooly } from '@shared/react-components'
import { Button, Spinner } from '@shared/ui'
import { getVaultId, NETWORK } from '@shared/utilities'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ParsedUrlQuery } from 'querystring'
import { useMemo } from 'react'
import { Address, isAddress } from 'viem'
import { SUPPORTED_NETWORKS } from '@constants/config'
import { useNetworks } from '@hooks/useNetworks'
import { VaultButtons } from './VaultButtons'
import { VaultPageExtraInfo } from './VaultPageExtraInfo'
import { VaultPageHeader } from './VaultPageHeader'
import { VaultPageInfo } from './VaultPageInfo'

interface VaultPageContentProps {
  queryParams: ParsedUrlQuery
}

export const VaultPageContent = (props: VaultPageContentProps) => {
  const { queryParams } = props

  const networks = useNetworks()
  const clientsByChain = usePublicClientsByChain()

  const { vaults } = useSelectedVaults()

  const rawChainId =
    !!queryParams.chainId && typeof queryParams.chainId === 'string'
      ? parseInt(queryParams.chainId)
      : undefined

  const chainId =
    !!rawChainId && networks.includes(rawChainId) ? (rawChainId as NETWORK) : undefined

  const address =
    !!queryParams.vaultAddress &&
    typeof queryParams.vaultAddress === 'string' &&
    isAddress(queryParams.vaultAddress)
      ? queryParams.vaultAddress
      : undefined

  const vault = useMemo(() => {
    if (!!chainId && !!address) {
      const vaultId = getVaultId({ chainId, address })
      return vaults?.vaults[vaultId] ?? new Vault(chainId, address, clientsByChain[chainId])
    }
  }, [chainId, address, vaults])

  const { data: vaultTokenAddress, isFetched: isFetchedVaultTokenAddress } = useVaultTokenAddress(
    vault!
  )

  if (!!chainId && !isFetchedVaultTokenAddress) {
    return (
      <>
        <VaultPageHeader vault={vault} />
        <Spinner />
      </>
    )
  }

  return (
    <>
      <VaultPageHeader vault={vault} className='max-w-[44rem]' />
      {!!vault && !!vaultTokenAddress ? (
        <>
          <VaultPageInfo vault={vault} className='max-w-[44rem]' />
          <VaultButtons
            vault={vault}
            forceShow={['delegate', 'withdraw']}
            className='max-w-[44rem]'
          />
          <VaultPageExtraInfo vault={vault} className='max-w-[44rem]' />
        </>
      ) : (
        <ErrorState chainId={rawChainId} tokenAddress={vaultTokenAddress} />
      )}
    </>
  )
}

interface ErrorStateProps {
  chainId?: number
  tokenAddress?: Address
}

const ErrorState = (props: ErrorStateProps) => {
  const { chainId, tokenAddress } = props

  const t_vault = useTranslations('Vault')
  const t_error = useTranslations('Error')

  const networks = useNetworks()

  const isInvalidNetwork = !chainId || !networks.includes(chainId)
  const isInvalidInterface = !tokenAddress

  return (
    <div className='w-full max-w-md flex flex-col gap-6 items-center text-center'>
      <ErrorPooly className='w-full max-w-[50%]' />
      {isInvalidNetwork ? (
        <div className='flex flex-col gap-2'>
          <span>{t_error('vaultInvalidNetwork')}</span>
          {!!chainId && SUPPORTED_NETWORKS.testnets.includes(chainId) && (
            <span>{t_error('vaultEnableTestnets')}</span>
          )}
          {!!chainId && SUPPORTED_NETWORKS.mainnets.includes(chainId) && (
            <span>{t_error('vaultDisableTestnets')}</span>
          )}
        </div>
      ) : isInvalidInterface ? (
        <span>{t_error('vaultInvalidInterface')}</span>
      ) : (
        <span>{t_error('vaultQueryError')}</span>
      )}
      <Link href='/vaults' passHref={true}>
        <Button>{t_vault('returnToVaults')}</Button>
      </Link>
    </div>
  )
}
