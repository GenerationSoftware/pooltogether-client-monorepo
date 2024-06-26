import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useAllUserVaultBalances,
  useSelectedVaultLists,
  useSelectedVaults,
  useSortedVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import { NetworkIcon } from '@shared/react-components'
import { VaultList } from '@shared/types'
import { TokenWithAmount } from '@shared/types'
import { Selection, SelectionItem } from '@shared/ui'
import { getVaultId, NETWORK, STABLECOINS } from '@shared/utilities'
import classNames from 'classnames'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useNetworks } from '@hooks/useNetworks'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'

export const filterIdAtom = atom<string>('all')
export const vaultListFilterIdAtom = atom<string>('all')

export const filteredVaultsAtom = atom<Vault[] | undefined>(undefined)

interface VaultFiltersProps {
  className?: string
}

export const VaultFilters = (props: VaultFiltersProps) => {
  const { className } = props

  const router = useRouter()

  const t = useTranslations('Vaults')

  const { address: userAddress } = useAccount()

  const networks = useNetworks()

  const { vaults } = useSelectedVaults()

  const prizePools = useSupportedPrizePools()
  const prizePoolsArray = Object.values(prizePools)

  const { sortedVaults, isFetched: isFetchedSortedVaults } = useSortedVaults(vaults, {
    prizePools: prizePoolsArray
  })

  const { localVaultLists, importedVaultLists } = useSelectedVaultLists()

  const { data: userVaultBalances, isFetched: isFetchedUserVaultBalances } =
    useAllUserVaultBalances(vaults, userAddress!)

  const [filterId, setFilterId] = useAtom(filterIdAtom)
  const vaultListFilterId = useAtomValue(vaultListFilterIdAtom)

  const setFilteredVaults = useSetAtom(filteredVaultsAtom)

  const listFilteredVaultsArray = useMemo(() => {
    return getVaultListIdFilteredVaults(
      vaultListFilterId,
      sortedVaults,
      { ...localVaultLists, ...importedVaultLists },
      userVaultBalances
    )
  }, [sortedVaults, vaultListFilterId, userVaultBalances])

  // Getting filter ID from URL query:
  useEffect(() => {
    const rawUrlNetwork =
      router.query['network'] || router.asPath.match(/(?<=[?&]network=)(\d*?)(?=(&|$))/)?.[0]
    const chainId =
      !!rawUrlNetwork && typeof rawUrlNetwork === 'string' ? parseInt(rawUrlNetwork) : undefined
    !!chainId && chainId in NETWORK && setFilterId(chainId.toString())
  }, [])

  const filterOnClick = (vaults: Vault[], filter: (vaults: Vault[]) => Vault[]) => {
    setFilteredVaults(filter(vaults))
  }

  const filterAll = () => {
    filterOnClick(listFilteredVaultsArray, (vaults) => vaults)
  }

  const filterStablecoins = () => {
    filterOnClick(listFilteredVaultsArray, (vaults) =>
      vaults.filter((vault) =>
        Object.keys(STABLECOINS[vault.chainId as NETWORK]).includes(
          vault.tokenAddress?.toLowerCase() ?? '?'
        )
      )
    )
  }

  const filterNetwork = (chainId: NETWORK) => {
    filterOnClick(listFilteredVaultsArray, (vaults) =>
      vaults.filter((vault) => vault.chainId === chainId)
    )
  }

  const filterItems: (SelectionItem & { filter: () => void })[] = useMemo(
    () => [
      {
        id: 'all',
        content: t('filters.showAll'),
        onClick: () => setFilterId('all'),
        filter: filterAll,
        className: 'whitespace-nowrap'
      },
      {
        id: 'stablecoin',
        content: t('filters.stablecoins'),
        onClick: () => setFilterId('stablecoin'),
        filter: filterStablecoins,
        className: 'whitespace-nowrap'
      },
      ...networks.map((network) => {
        return {
          id: network.toString(),
          content: <NetworkIcon chainId={network} className='h-5 w-5' />,
          onClick: () => setFilterId(network.toString()),
          filter: () => filterNetwork(network)
        }
      })
    ],
    [networks, isFetchedUserVaultBalances, listFilteredVaultsArray]
  )

  useEffect(() => {
    isFetchedSortedVaults && filterItems.find((item) => item.id === filterId)?.filter()
  }, [filterItems, filterId, listFilteredVaultsArray, isFetchedSortedVaults])

  if (router.isReady) {
    return (
      <div className='w-full flex justify-center'>
        <div
          className={classNames(
            'flex justify-between items-center overflow-x-auto no-scrollbar',
            'lg:bg-pt-bg-purple-dark lg:py-4 lg:px-8 lg:rounded-3xl',
            className
          )}
        >
          <Selection items={filterItems} activeItem={filterId} buttonColor='purple' />
        </div>
      </div>
    )
  }

  return <></>
}

const getVaultListIdFilteredVaults = (
  id: string,
  vaults: Vault[],
  vaultLists: {
    [id: string]: VaultList
  },
  userVaultBalances?: { [vaultId: string]: TokenWithAmount }
) => {
  const validVaults = vaults.filter(
    (vault) => id === 'all' || vaultLists[id]?.tokens.find((v) => vault.id === getVaultId(v))
  )

  const activeOrDepositedVaults = validVaults.filter((vault) => {
    const isDeprecated = vault.tags?.includes('deprecated')
    const isDeposited = (userVaultBalances?.[vault.id]?.amount ?? 0n) > 0n

    return isDeprecated ? (isDeposited ? true : false) : true
  })

  return activeOrDepositedVaults
}
