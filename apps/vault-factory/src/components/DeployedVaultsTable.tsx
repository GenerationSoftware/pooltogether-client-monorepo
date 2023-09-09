import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useVaultClaimer,
  useVaultFeesAvailable,
  useVaultLiquidationPair,
  useVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import { useScreenSize } from '@shared/generic-react-hooks'
import { VaultBadge } from '@shared/react-components'
import { Button, LINKS, Spinner, Table, TableData } from '@shared/ui'
import { getBlockExplorerUrl, shorten } from '@shared/utilities'
import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { VaultState } from 'src/types'
import { zeroAddress } from 'viem'
import { useAccount } from 'wagmi'
import { useDeployedVaults } from '@hooks/useDeployedVaults'
import { useDeployedVaultState } from '@hooks/useDeployedVaultState'
import { useLiquidationPairSteps } from '@hooks/useLiquidationPairSteps'
import { ClaimVaultFeesButton } from './buttons/ClaimVaultFeesButton'
import { DeployedVaultCard } from './DeployedVaultCard'

interface DeployedVaultsTableProps {
  className?: string
}

export const DeployedVaultsTable = (props: DeployedVaultsTableProps) => {
  const { className } = props

  const { vaultInfoArray } = useDeployedVaults()
  const vaults = useVaults(vaultInfoArray, { useAllChains: true })
  const vaultsArray = Object.values(vaults.vaults)

  const { width: screenWidth } = useScreenSize()
  const isMobile = !!screenWidth && screenWidth < 1024

  const tableData: TableData = {
    headers: {
      name: { content: 'Name', className: 'pl-11' },
      address: { content: 'Address', position: 'center' },
      liquidator: { content: 'Liquidation Pair', position: 'center' },
      claimer: { content: 'Claimer', position: 'center' },
      status: { content: 'Status', position: 'center' },
      actions: { content: 'Actions', position: 'center' }
    },
    rows: vaultsArray.map((vault) => ({
      id: vault.id,
      cells: {
        name: {
          content: <VaultNameItem vault={vault} />
        },
        address: {
          content: <VaultAddressItem vault={vault} />,
          position: 'center'
        },
        liquidator: {
          content: <VaultLiquidationPairItem vault={vault} />,
          position: 'center'
        },
        claimer: {
          content: <VaultClaimerItem vault={vault} />,
          position: 'center'
        },
        status: {
          content: <VaultStatusItem vault={vault} />,
          position: 'center'
        },
        actions: {
          content: <VaultActionsItem vault={vault} />,
          position: 'center'
        }
      }
    }))
  }

  if (tableData.rows.length === 0) {
    return (
      <div
        className={classNames(
          'flex flex-col items-center p-6 bg-pt-transparent/20 rounded-3xl',
          className
        )}
      >
        <span className='text-center text-sm text-pt-purple-200 lg:text-base'>
          You haven't deployed any vaults{' '}
          <span className='text-pt-purple-50'>(or you cleared your local storage)</span>
        </span>
      </div>
    )
  }

  if (isMobile) {
    return (
      <div className='w-full flex flex-col gap-4 items-center'>
        {vaultsArray.map((vault) => (
          <DeployedVaultCard key={`deployedVault-${vault.id}`} vault={vault} />
        ))}
      </div>
    )
  }

  return (
    <Table
      keyPrefix='deployedVaultsTable'
      data={tableData}
      className={classNames('px-6 pb-6 bg-pt-transparent/20 rounded-3xl', className)}
      innerClassName='overflow-y-auto'
      headerClassName='text-center font-medium text-pt-purple-300 whitespace-nowrap'
      rowClassName='text-sm font-medium rounded-lg overflow-hidden'
      gridColsClassName={`grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]`}
    />
  )
}

interface ItemProps {
  vault: Vault
}

const VaultNameItem = (props: ItemProps) => {
  const { vault } = props

  return (
    <Link href={`${LINKS.app}/vault/${vault.chainId}/${vault.address}`} target='_blank'>
      <VaultBadge vault={vault} onClick={() => {}} symbolClassName='hidden' />
    </Link>
  )
}

const VaultAddressItem = (props: ItemProps) => {
  const { vault } = props

  return (
    <a href={getBlockExplorerUrl(vault.chainId, vault.address)} target='_blank'>
      {shorten(vault.address)}
    </a>
  )
}

const VaultLiquidationPairItem = (props: ItemProps) => {
  const { vault } = props

  const { data: liquidationPair, isFetched: isFetchedLiquidationPair } =
    useVaultLiquidationPair(vault)

  if (!isFetchedLiquidationPair) {
    return <WrappedSpinner />
  }

  if (!liquidationPair || liquidationPair === zeroAddress) {
    return <span className='text-sm text-pt-warning-light'>not set</span>
  }

  return (
    <a href={getBlockExplorerUrl(vault.chainId, liquidationPair)} target='_blank'>
      {shorten(liquidationPair)}
    </a>
  )
}

const VaultClaimerItem = (props: ItemProps) => {
  const { vault } = props

  const { data: claimer, isFetched: isFetchedClaimer } = useVaultClaimer(vault)

  if (!isFetchedClaimer) {
    return <WrappedSpinner />
  }

  if (!claimer || claimer === zeroAddress) {
    return <span className='text-sm text-pt-warning-light'>not set</span>
  }

  return (
    <a href={getBlockExplorerUrl(vault.chainId, claimer)} target='_blank'>
      {shorten(claimer)}
    </a>
  )
}

// TODO: add checkmark / warning icons
const VaultStatusItem = (props: ItemProps) => {
  const { vault } = props

  const { vaultState } = useDeployedVaultState(vault)

  if (vaultState === 'invalid') {
    return <span className='text-sm text-pt-warning-light'>invalid</span>
  }

  if (vaultState === 'missingLiquidationPair' || vaultState === 'missingClaimer') {
    return <span className='text-sm text-pt-warning-light'>incomplete</span>
  }

  if (vaultState === 'active') {
    return <span className='text-sm text-pt-purple-300'>active</span>
  }

  return <WrappedSpinner />
}

const VaultActionsItem = (props: ItemProps) => {
  const { vault } = props

  const router = useRouter()

  const { address: userAddress } = useAccount()

  const { vaultState } = useDeployedVaultState(vault)

  const { setStep: setLpStep } = useLiquidationPairSteps()

  const { data: vaultFeesAvailable } = useVaultFeesAvailable(vault)

  const onClickCompleteSetup = (state: VaultState) => {
    if (state === 'missingLiquidationPair') {
      setLpStep(0)
      router.push(`/lp/${vault.chainId}/${vault.address}`)
    }
  }

  if (vaultState === 'missingLiquidationPair') {
    return (
      <Button onClick={() => onClickCompleteSetup(vaultState)} color='red'>
        Complete Setup
      </Button>
    )
  }

  if (vaultState === 'active' && !!userAddress && !!vaultFeesAvailable) {
    return <ClaimVaultFeesButton vault={vault} />
  }

  return <></>
}

// NOTE: This is wrapped to avoid table overflow on spinner animation
const WrappedSpinner = () => {
  return (
    <div className='h-5 w-5 relative'>
      <Spinner className='absolute' />
    </div>
  )
}
