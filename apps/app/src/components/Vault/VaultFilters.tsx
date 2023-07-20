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
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useNetworks } from '@hooks/useNetworks'
import { useSettingsModalView } from '@hooks/useSettingsModalView'

export const filterIdAtom = atom<string>('all')

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
  const vaultsArray = useMemo(() => Object.values(vaults.vaults), [vaults])

  const { address: userAddress } = useAccount()

  const { data: userTokenBalances, isFetched: isFetchedUserTokenBalances } =
    useTokenBalancesAcrossChains(
      networks,
      userAddress as Address,
      vaults.underlyingTokenAddresses?.byChain ?? {}
    )

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
        return userWalletBalance > 0n
      })
    )
  }

  const filterStablecoins = () => {
    filterOnClick(vaultsArray, (vaults) =>
      vaults.filter((vault) =>
        STABLECOIN_ADDRESSES[vault.chainId as NETWORK].includes(
          (vault.tokenAddress?.toLowerCase() as Lowercase<string>) ?? '?'
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
        onClick: () => {
          setFilterId('all')
          filterAll()
        },
        filter: filterAll,
        className: 'whitespace-nowrap'
      },
      {
        id: 'userWallet',
        content: t('filters.inWallet'),
        disabled: !isFetchedUserTokenBalances,
        onClick: () => {
          setFilterId('userWallet')
          filterUserWallet()
        },
        filter: filterUserWallet,
        className: 'whitespace-nowrap'
      },
      {
        id: 'stablecoin',
        content: t('filters.stablecoins'),
        onClick: () => {
          setFilterId('stablecoin')
          filterStablecoins()
        },
        filter: filterStablecoins,
        className: 'whitespace-nowrap'
      },
      ...networks.map((network) => {
        return {
          id: network.toString(),
          content: <NetworkIcon chainId={network} className='h-5 w-5' />,
          onClick: () => {
            setFilterId(network.toString())
            filterNetwork(network)
          },
          filter: () => filterNetwork(network)
        }
      })
    ],
    [networks, isFetchedUserTokenBalances, vaultsArray]
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
          <span
            onClick={() => {
              setSettingsModalView('vaultLists')
              setIsSettingsModalOpen(true)
            }}
            className='hidden text-lg text-pt-purple-100 cursor-pointer whitespace-nowrap lg:block'
          >
            {t('manageVaultLists')}
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
    vaultsByChain[vault.chainId]?.push(vault)
  })

  return vaultsByChain
}
