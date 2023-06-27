import { NETWORK, STABLECOIN_ADDRESSES, Vault } from '@pooltogether/hyperstructure-client-js'
import {
  useSelectedVaults,
  useTokenBalancesAcrossChains
} from '@pooltogether/hyperstructure-react-hooks'
import { MODAL_KEYS, useIsModalOpen } from '@shared/generic-react-hooks'
import { NetworkIcon } from '@shared/react-components'
import { Selection, SelectionItem } from '@shared/ui'
import classNames from 'classnames'
import { atom, useAtom, useSetAtom } from 'jotai'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useNetworks } from '@hooks/useNetworks'

export const filterIdAtom = atom<string>('all')

export const filteredVaultsAtom = atom<{ [chainId: number]: Vault[] }>({})

interface VaultFiltersProps {
  className?: string
}

export const VaultFilters = (props: VaultFiltersProps) => {
  const { className } = props

  const router = useRouter()

  const networks = useNetworks()

  const { vaults } = useSelectedVaults()
  const vaultsArray = useMemo(() => Object.values(vaults.vaults), [vaults])

  const { address: userAddress } = useAccount()

  const { data: userTokenBalances, isFetched: isFetchedUserTokenBalances } =
    useTokenBalancesAcrossChains(
      networks,
      userAddress as `0x${string}`,
      vaults.underlyingTokenAddresses?.byChain ?? {}
    )

  const [filterId, setFilterId] = useAtom(filterIdAtom)

  const setFilteredVaults = useSetAtom(filteredVaultsAtom)

  const { setIsModalOpen: setIsSettingsModalOpen } = useIsModalOpen(MODAL_KEYS.settings)

  // Getting filter ID from URL query:
  useEffect(() => {
    const rawUrlNetwork = router.query['network']
    const chainId =
      !!rawUrlNetwork && typeof rawUrlNetwork === 'string' ? parseInt(rawUrlNetwork) : undefined
    !!chainId && chainId in NETWORK && setFilterId(chainId.toString())
  }, [])

  const filterOnClick = (
    id: string,
    vaults: Vault[],
    filter: (vaults: Vault[]) => Vault[] | undefined
  ) => {
    setFilterId(id)
    const filteredVaultsArray = filter(vaults.filter((vault) => !!vault.tokenAddress)) ?? []
    const filteredVaultsByChain = formatVaultsByChain(networks, filteredVaultsArray)
    setFilteredVaults(filteredVaultsByChain)
  }

  const filterItems: SelectionItem[] = useMemo(
    () => [
      {
        id: 'all',
        content: 'Show All',
        onClick: () => filterOnClick('all', vaultsArray, (vaults) => vaults),
        className: 'whitespace-nowrap'
      },
      {
        id: 'userWallet',
        content: 'In My Wallet',
        disabled: !isFetchedUserTokenBalances,
        onClick: () =>
          filterOnClick('userWallet', vaultsArray, (vaults) =>
            vaults.filter((vault) => {
              const userWalletBalance = !!vault.tokenAddress
                ? userTokenBalances?.[vault.chainId]?.[vault.tokenAddress]?.amount ?? 0n
                : 0n
              return userWalletBalance > 0n
            })
          ),
        className: 'whitespace-nowrap'
      },
      {
        id: 'stablecoin',
        content: 'Stablecoins',
        onClick: () =>
          filterOnClick('stablecoin', vaultsArray, (vaults) =>
            vaults.filter((vault) =>
              STABLECOIN_ADDRESSES[vault.chainId as NETWORK].includes(
                vault.tokenAddress?.toLowerCase() as Lowercase<string> ?? '?'
              )
            )
          )
      },
      ...networks.map((network) => {
        return {
          id: network.toString(),
          content: <NetworkIcon chainId={network} className='h-5 w-5' />,
          onClick: () =>
            filterOnClick(network.toString(), vaultsArray, (vaults) =>
              vaults.filter((vault) => vault.chainId === network)
            )
        }
      })
    ],
    [networks, isFetchedUserTokenBalances, vaultsArray]
  )

  useEffect(() => {
    const filterItem = filterItems.find((item) => item.id === filterId)
    !!filterItem && filterItem.onClick?.()
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
            <span className='hidden text-lg lg:block'>Filter</span>
            <Selection items={filterItems} activeItem={filterId} buttonColor='purple' />
          </div>
          <span
            onClick={() => setIsSettingsModalOpen(true)}
            className='hidden text-lg text-pt-purple-100 cursor-pointer whitespace-nowrap lg:block'
          >
            Manage Vault Lists
          </span>
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
    vaultsByChain[vault.chainId].push(vault)
  })

  return vaultsByChain
}
