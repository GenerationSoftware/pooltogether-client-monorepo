import { Vault } from '@pooltogether/hyperstructure-client-js'
import {
  useVaultClaimer,
  useVaultLiquidationPair,
  useVaults
} from '@pooltogether/hyperstructure-react-hooks'
import { VaultBadge } from '@shared/react-components'
import { Button, LINKS, Spinner, Table, TableData } from '@shared/ui'
import { getBlockExplorerUrl, shorten } from '@shared/utilities'
import classNames from 'classnames'
import Link from 'next/link'
import { VaultState } from 'src/types'
import { zeroAddress } from 'viem'
import { useDeployedVaults } from '@hooks/useDeployedVaults'
import { useDeployedVaultState } from '@hooks/useDeployedVaultState'

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
      liquidator: { content: 'Liquidity Pair', position: 'center' },
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
          content: <VaultLiquidityPairItem vault={vault} />,
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

const VaultLiquidityPairItem = (props: ItemProps) => {
  const { vault } = props

  const { data: liquidityPair, isFetched: isFetchedLiquidityPair } = useVaultLiquidationPair(vault)

  if (!isFetchedLiquidityPair) {
    return <WrappedSpinner />
  }

  if (!liquidityPair || liquidityPair === zeroAddress) {
    return <span className='text-sm text-pt-warning-light'>not set</span>
  }

  return (
    <a href={getBlockExplorerUrl(vault.chainId, liquidityPair)} target='_blank'>
      {shorten(liquidityPair)}
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

  const { vaultState } = useDeployedVaultState(vault)

  const onClickCompleteSetup = (state: VaultState) => {
    if (state === 'missingLiquidationPair') {
      // TODO: send user to 2 step flow for specific vault - deploy lp, set lp
    } else if (state === 'missingClaimer') {
      // TODO: send user to 1 step flow for specific vault - set claimer
    }
  }

  if (vaultState === 'missingLiquidationPair' || vaultState === 'missingClaimer') {
    return (
      <Button onClick={() => onClickCompleteSetup(vaultState)} color='red' disabled={true}>
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

// NOTE: This is wrapped to avoid table overflow on spinner animation
const WrappedSpinner = () => {
  return (
    <div className='h-5 w-5 relative'>
      <Spinner className='absolute' />
    </div>
  )
}
