import { Vault } from '@pooltogether/hyperstructure-client-js'
import {
  useVaultClaimer,
  useVaultLiquidationPair,
  useVaults
} from '@pooltogether/hyperstructure-react-hooks'
import { VaultBadge } from '@shared/react-components'
import { Button, Spinner, Table, TableData } from '@shared/ui'
import { shorten } from '@shared/utilities'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { VaultState } from 'src/types'
import { useDeployedVaults } from '@hooks/useDeployedVaults'
import { useDeployedVaultState } from '@hooks/useDeployedVaultState'
import { useSteps } from '@hooks/useSteps'

interface DeployedVaultsTableProps {
  className?: string
}

export const DeployedVaultsTable = (props: DeployedVaultsTableProps) => {
  const { className } = props

  const { vaultInfoArray } = useDeployedVaults()
  const vaults = useVaults(vaultInfoArray)
  const vaultsArray = Object.values(vaults.vaults)

  const tableData: TableData = {
    headers: {
      name: { content: 'Name', className: 'pl-11' },
      address: { content: 'Address', position: 'center' },
      liquidator: { content: 'Liquidator', position: 'center' },
      claimer: { content: 'Claimer', position: 'center' },
      status: { content: 'Status', position: 'center' },
      actions: { content: 'Actions', position: 'center' }
    },
    rows: vaultsArray.map((vault) => ({
      id: vault.id,
      cells: {
        name: {
          content: <VaultBadge vault={vault} className='w-full' symbolClassName='hidden' />
        },
        address: {
          content: <AddressDisplay address={vault.address} />,
          position: 'center'
        },
        liquidator: {
          content: <VaultLiquidatorItem vault={vault} />,
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
        <span className='text-3xl text-pt-purple-200'>You haven't deployed any vaults... yet.</span>
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

const VaultLiquidatorItem = (props: ItemProps) => {
  const { vault } = props

  const { data: liquidator, isFetched: isFetchedLiquidator } = useVaultLiquidationPair(vault)

  if (!isFetchedLiquidator) {
    return <WrappedSpinner />
  }

  if (!liquidator) {
    return <span className='text-sm text-pt-warning-light'>not set</span>
  }

  return <AddressDisplay address={liquidator} />
}

const VaultClaimerItem = (props: ItemProps) => {
  const { vault } = props

  const { data: claimer, isFetched: isFetchedClaimer } = useVaultClaimer(vault)

  if (!isFetchedClaimer) {
    return <WrappedSpinner />
  }

  if (!claimer) {
    return <span className='text-sm text-pt-warning-light'>not set</span>
  }

  return <AddressDisplay address={claimer} />
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

  const { setStep } = useSteps()

  const { vaultState } = useDeployedVaultState(vault)

  const onClickCompleteSetup = (state: VaultState) => {
    if (state === 'missingLiquidationPair') {
      setStep(0) // TODO: set proper step
      router.replace('/create')
    } else if (state === 'missingClaimer') {
      setStep(0) // TODO: set proper step
      router.replace('/create')
    }
  }

  if (vaultState === 'missingLiquidationPair' || vaultState === 'missingClaimer') {
    return (
      <Button onClick={() => onClickCompleteSetup(vaultState)} color='red'>
        Complete Setup
      </Button>
    )
  }

  const onClickClaimFees = () => {
    // TODO: claim fees' functionality and enable button
  }

  if (vaultState === 'active') {
    return (
      <Button onClick={onClickClaimFees} color='transparent' disabled={true}>
        Claim Fees
      </Button>
    )
  }

  return <></>
}

const AddressDisplay = (props: { address: string }) => {
  const { address } = props

  return <span title={address}>{shorten(address)}</span>
}

// NOTE: This is wrapped to avoid table overflow on spinner animation
const WrappedSpinner = () => {
  return (
    <div className='h-5 w-5 relative'>
      <Spinner className='absolute' />
    </div>
  )
}
