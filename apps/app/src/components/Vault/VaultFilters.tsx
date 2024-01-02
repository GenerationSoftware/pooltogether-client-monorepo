import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useAllUserVaultBalances,
  useSelectedVaultLists,
  useSelectedVaults,
  useTokenBalancesAcrossChains
} from '@generationsoftware/hyperstructure-react-hooks'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { MODAL_KEYS, useIsModalOpen } from '@shared/generic-react-hooks'
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
import { useSettingsModalView } from '@hooks/useSettingsModalView'
import { VaultListFilterSelect } from './VaultListFilterSelect'

export const filterIdAtom = atom<string>('all')
export const vaultListFilterIdAtom = atom<string>('all')

export const filteredVaultsAtom = atom<{ [chainId: number]: Vault[] }>({})

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

  const { setIsModalOpen: setIsSettingsModalOpen } = useIsModalOpen(MODAL_KEYS.settings)
  const { setView: setSettingsModalView } = useSettingsModalView()

  // Getting filter ID from URL query:
  useEffect(() => {
    const rawUrlNetwork = router.query['network']
    const chainId =
      !!rawUrlNetwork && typeof rawUrlNetwork === 'string' ? parseInt(rawUrlNetwork) : undefined
    !!chainId && chainId in NETWORK && setFilterId(chainId.toString())
  }, [])

  const filterOnClick = (vaults: Vault[], filter: (vaults: Vault[]) => Vault[] | undefined) => {
    const filteredVaultsArray = filter(vaults.filter((vault) => !!vault.tokenAddress)) ?? []
    const filteredVaultsByChain = formatVaultsByChain(networks, filteredVaultsArray)
    setFilteredVaults(filteredVaultsByChain)
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
            'w-screen max-w-[36rem] flex justify-between items-center -mx-4 px-4 rounded-lg overflow-x-auto no-scrollbar',
            'lg:w-full lg:max-w-none lg:dark:bg-pt-bg-purple-dark lg:mx-0 lg:px-6 lg:py-5',
            className
          )}
        >
          <div className='flex items-center gap-8 py-0.5'>
            <span className='hidden text-lg lg:block'>{t('filter')}</span>
            <Selection items={filterItems} activeItem={filterId} buttonColor='purple' />
          </div>
          <div className='hidden gap-2 items-center lg:flex'>
            <Cog6ToothIcon
              onClick={() => {
                setSettingsModalView('vaultLists')
                setIsSettingsModalOpen(true)
              }}
              className='h-6 w-6 text-pt-purple-100 cursor-pointer'
            />
            <VaultListFilterSelect />
          </div>
        </div>
      </div>
    )
  }

  return <></>
}

const formatVaultsByChain = (
  networks: NETWORK[],
  vaultsArray: Vault[]
): { [chainId: number]: Vault[] } => {
  const vaultsByChain: { [chainId: number]: Vault[] } = {}

  networks.forEach((network) => {
    vaultsByChain[network] = []
  })

  vaultsArray.forEach((vault) => {
    vaultsByChain[vault.chainId]?.push(vault)
  })

  return vaultsByChain
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
