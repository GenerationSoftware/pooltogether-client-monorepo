import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useAllUserVaultBalances,
  useSelectedVaultLists,
  useSelectedVaults,
  useTokenBalancesAcrossChains
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
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useNetworks } from '@hooks/useNetworks'

export const filterIdAtom = atom<string>('all')
export const vaultListFilterIdAtom = atom<string>('all')

export const filteredVaultsAtom = atom<Vault[]>([])

interface VaultFiltersProps {
  className?: string
}

export const VaultFilters = (props: VaultFiltersProps) => {
  const { className } = props

  const router = useRouter()

  const t = useTranslations('Vaults')

  const networks = useNetworks()

  const { vaults } = useSelectedVaults()

  const { localVaultLists, importedVaultLists } = useSelectedVaultLists()

  const vaultListFilterId = useAtomValue(vaultListFilterIdAtom)

  const { address: userAddress } = useAccount()

  const { data: userTokenBalances, isFetched: isFetchedUserTokenBalances } =
    useTokenBalancesAcrossChains(
      networks,
      userAddress as Address,
      vaults.underlyingTokenAddresses?.byChain ?? {},
      { refetchOnWindowFocus: true }
    )

  const { data: userVaultBalances, isFetched: isFetchedUserVaultBalances } =
    useAllUserVaultBalances(vaults, userAddress as Address)

  const vaultsArray = useMemo(() => {
    return getVaultListIdFilteredVaults(
      vaultListFilterId,
      Object.values(vaults.vaults),
      { ...localVaultLists, ...importedVaultLists },
      userVaultBalances
    )
  }, [vaults, vaultListFilterId, userVaultBalances])

  const [filterId, setFilterId] = useAtom(filterIdAtom)

  const setFilteredVaults = useSetAtom(filteredVaultsAtom)

  // Getting filter ID from URL query:
  useEffect(() => {
    const rawUrlNetwork =
      router.query['network'] || router.asPath.match(/(?<=[?&]network=)(\d*?)(?=(&|$))/)?.[0]
    const chainId =
      !!rawUrlNetwork && typeof rawUrlNetwork === 'string' ? parseInt(rawUrlNetwork) : undefined
    !!chainId && chainId in NETWORK && setFilterId(chainId.toString())
  }, [])

  const filterOnClick = (vaults: Vault[], filter: (vaults: Vault[]) => Vault[] | undefined) => {
    const filteredVaultsArray = filter(vaults.filter((vault) => !!vault.tokenAddress)) ?? []
    setFilteredVaults(filteredVaultsArray)
  }

  const filterAll = () => {
    filterOnClick(vaultsArray, (vaults) => vaults)
  }

  const filterUserWallet = () => {
    filterOnClick(vaultsArray, (vaults) =>
      vaults.filter((vault) => {
        const userWalletBalance = !!vault.tokenAddress
          ? userTokenBalances?.[vault.chainId]?.[vault.tokenAddress]?.amount ?? 0n
          : 0n
        const userDepositedBalance = userVaultBalances?.[vault.id]?.amount ?? 0n
        return userWalletBalance > 0n || userDepositedBalance > 0n
      })
    )
  }

  const filterStablecoins = () => {
    filterOnClick(vaultsArray, (vaults) =>
      vaults.filter((vault) =>
        Object.keys(STABLECOINS[vault.chainId as NETWORK]).includes(
          vault.tokenAddress?.toLowerCase() ?? '?'
        )
      )
    )
  }

  const filterNetwork = (chainId: NETWORK) => {
    filterOnClick(vaultsArray, (vaults) => vaults.filter((vault) => vault.chainId === chainId))
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
        id: 'userWallet',
        content: t('filters.inWallet'),
        disabled: !isFetchedUserTokenBalances || !isFetchedUserVaultBalances,
        onClick: () => setFilterId('userWallet'),
        filter: filterUserWallet,
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
    [networks, isFetchedUserTokenBalances, isFetchedUserVaultBalances, vaultsArray]
  )

  useEffect(() => {
    const filterItem = filterItems.find((item) => item.id === filterId)
    !!filterItem && filterItem.filter()
  }, [filterItems, filterId, vaultsArray])

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
