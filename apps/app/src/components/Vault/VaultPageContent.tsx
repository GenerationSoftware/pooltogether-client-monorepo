import { Vault } from '@pooltogether/hyperstructure-client-js'
import {
  usePublicClientsByChain,
  useSelectedVaults,
  useVaultTokenAddress
} from '@pooltogether/hyperstructure-react-hooks'
import { ErrorPooly } from '@shared/react-components'
import { Button } from '@shared/ui'
import { getVaultId, NETWORK } from '@shared/utilities'
import Link from 'next/link'
import { ParsedUrlQuery } from 'querystring'
import { useMemo } from 'react'
import { isAddress } from 'viem'
import { useNetworks } from '@hooks/useNetworks'
import { VaultPageButtons } from './VaultPageButtons'
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

  const chainId =
    !!queryParams.chainId &&
    typeof queryParams.chainId === 'string' &&
    networks.includes(parseInt(queryParams.chainId))
      ? (parseInt(queryParams.chainId) as NETWORK)
      : undefined

  const address =
    !!queryParams.urlVaultAddress &&
    typeof queryParams.urlVaultAddress === 'string' &&
    isAddress(queryParams.urlVaultAddress)
      ? queryParams.urlVaultAddress
      : undefined

  const vault = useMemo(() => {
    if (!!chainId && !!address) {
      const vaultId = getVaultId({ chainId, address })
      return vaults?.vaults[vaultId] ?? new Vault(chainId, address, clientsByChain[chainId])
    }
  }, [chainId, address, vaults])

  const { data: vaultTokenAddress, isFetched: isFetchedVaultTokenAddress } = useVaultTokenAddress(
    vault as Vault
  )

  const isInvalidVault = isFetchedVaultTokenAddress && !vaultTokenAddress

  if (!!vault) {
    return (
      <>
        <VaultPageHeader vault={vault} />
        {!isInvalidVault ? (
          <>
            <VaultPageInfo vault={vault} />
            <VaultPageButtons vault={vault} />
          </>
        ) : (
          <ErrorState />
        )}
      </>
    )
  }

  return <ErrorState />
}

const ErrorState = () => {
  return (
    <div className='flex flex-col gap-6 items-center text-center'>
      <ErrorPooly className='w-full max-w-[50%]' />
      <span>Something went wrong while querying this vault's info.</span>
      <Link href='/vaults' passHref={true}>
        <Button>Return to Vaults</Button>
      </Link>
    </div>
  )
}
