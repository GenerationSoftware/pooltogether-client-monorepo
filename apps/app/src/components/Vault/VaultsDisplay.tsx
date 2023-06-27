import {
  useSelectedVaultListIds,
  useSelectedVaults
} from '@pooltogether/hyperstructure-react-hooks'
import { MODAL_KEYS, useIsModalOpen } from '@shared/generic-react-hooks'
import { NetworkBadge } from '@shared/react-components'
import { Button, Spinner } from '@shared/ui'
import { useAtomValue, useSetAtom } from 'jotai'
import { useRouter } from 'next/router'
import { useNetworks } from '@hooks/useNetworks'
import { VaultCards } from './VaultCards'
import { filteredVaultsAtom, filterIdAtom } from './VaultFilters'
import { VaultsTable } from './VaultsTable'

export const VaultsDisplay = () => {
  const router = useRouter()

  const networks = useNetworks()

  const { isFetched: isFetchedVaultData } = useSelectedVaults()

  const { localIds, importedIds } = useSelectedVaultListIds()

  const filteredVaults = useAtomValue(filteredVaultsAtom)

  if (!isFetchedVaultData) {
    return <Spinner />
  }

  const noSelectedVaultLists = localIds.length + importedIds.length === 0

  if (noSelectedVaultLists) {
    return <NoSelectedVaultListsCard />
  }

  const noValidVaults =
    Object.keys(filteredVaults).length === 0 ||
    Object.values(filteredVaults).every((array) => array.length === 0)

  if (noValidVaults) {
    return <NoValidVaultsCard />
  }

  return (
    <>
      {networks.map((network) => {
        if (filteredVaults[network] === undefined || filteredVaults[network].length === 0) return
        return (
          <div key={`pp-${network}`} className='w-full flex flex-col items-center gap-4 md:gap-6'>
            <NetworkBadge
              chainId={network}
              appendText='Prize Pool'
              textClassName='text-lg font-medium'
              onClick={() => router.push(`/prizes?network=${network}`)}
            />
            <VaultsTable
              chainId={network}
              vaults={filteredVaults[network]}
              className='hidden lg:block'
            />
            <VaultCards chainId={network} vaults={filteredVaults[network]} className='lg:hidden' />
          </div>
        )
      })}
    </>
  )
}

const NoSelectedVaultListsCard = () => {
  const { setIsModalOpen: setIsSettingsModalOpen } = useIsModalOpen(MODAL_KEYS.settings)

  return (
    <div className='flex flex-col items-center text-center p-6 bg-pt-transparent rounded-lg md:min-w-[480px]'>
      <DocumentSVG className='w-12 h-auto' />
      <span className='text-xl font-semibold py-2 text-pt-purple-400'>Oops!</span>
      <span className='text-pt-purple-100'>
        It looks like you don't have any valid vault lists enabled.
      </span>
      <Button onClick={() => setIsSettingsModalOpen(true)} color='transparent' className='mt-6'>
        Manage Vault Lists
      </Button>
    </div>
  )
}

const NoValidVaultsCard = () => {
  const { setIsModalOpen: setIsSettingsModalOpen } = useIsModalOpen(MODAL_KEYS.settings)

  const setFilterId = useSetAtom(filterIdAtom)

  return (
    <div className='flex flex-col items-center text-center p-6 bg-pt-transparent rounded-lg md:min-w-[480px]'>
      <GaugesSVG className='w-14 h-auto' />
      <span className='text-xl font-semibold py-2 text-pt-purple-400'>Oops!</span>
      <span className='text-pt-purple-100'>There are no vaults that match your filters.</span>
      <div className='flex flex-col gap-2 mt-6'>
        <Button onClick={() => setFilterId('all')} color='transparent' fullSized={true}>
          Clear Filters
        </Button>
        <Button onClick={() => setIsSettingsModalOpen(true)} color='transparent' fullSized={true}>
          Manage Vault Lists
        </Button>
      </div>
    </div>
  )
}

const DocumentSVG = (props: { className?: string }) => (
  <svg
    viewBox='0 0 48 60'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className={props.className}
  >
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M2.39941 10.0688V59.7133H47.4213V0H12.4348L2.39941 10.0688Z'
      fill='#35F0D0'
    />
    <path
      d='M2.39953 9.95235L12.3449 9.95235L12.3517 5.75455e-05L2.39953 9.95235Z'
      fill='#0DC5A5'
    />
    <circle cx='10.4219' cy='14' r='2' fill='#0DC5A5' />
    <circle cx='10.4219' cy='23' r='2' fill='#0DC5A5' />
    <circle cx='10.4219' cy='32' r='2' fill='#0DC5A5' />
    <circle cx='10.4219' cy='41' r='2' fill='#0DC5A5' />
    <circle cx='10.4219' cy='50' r='2' fill='#0DC5A5' />
    <path d='M15.4219 13.5H42.4219' stroke='#0DC5A5' strokeLinecap='round' />
    <path d='M15.4219 23H42.4219' stroke='#0DC5A5' strokeLinecap='round' />
    <path d='M15.4219 32H42.4219' stroke='#0DC5A5' strokeLinecap='round' />
    <path d='M15.4219 41H42.4219' stroke='#0DC5A5' strokeLinecap='round' />
    <path d='M15.4219 50H42.4219' stroke='#0DC5A5' strokeLinecap='round' />
  </svg>
)

const GaugesSVG = (props: { className?: string }) => (
  <svg
    viewBox='0 0 60 60'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className={props.className}
  >
    <rect width='100%' height='100%' rx='8' fill='#35F0D0' />
    <path d='M11.5 11L11.5 51' stroke='#0DC5A5' strokeWidth='2' strokeLinecap='round' />
    <path d='M30.5 11L30.5 51' stroke='#0DC5A5' strokeWidth='2' strokeLinecap='round' />
    <path d='M49.5 11L49.5 51' stroke='#0DC5A5' strokeWidth='2' strokeLinecap='round' />
    <path d='M7 19.5H16' stroke='#0DC5A5' strokeWidth='2' strokeLinecap='round' />
    <path d='M26 42H35' stroke='#0DC5A5' strokeWidth='2' strokeLinecap='round' />
    <path d='M45 29H54' stroke='#0DC5A5' strokeWidth='2' strokeLinecap='round' />
  </svg>
)
