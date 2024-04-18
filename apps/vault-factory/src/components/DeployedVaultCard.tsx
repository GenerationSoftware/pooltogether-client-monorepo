import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useVaultClaimer,
  useVaultLiquidationPair,
  useVaultOwner
} from '@generationsoftware/hyperstructure-react-hooks'
import { ArrowPathRoundedSquareIcon, TrashIcon, WrenchIcon } from '@heroicons/react/24/outline'
import { VaultBadge } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import { getBlockExplorerUrl, LINKS, shorten } from '@shared/utilities'
import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { zeroAddress } from 'viem'
import { useAccount } from 'wagmi'
import { useDeployedVaultState } from '@hooks/useDeployedVaultState'
import { useLiquidationPairSteps } from '@hooks/useLiquidationPairSteps'
import { useUserDeployedVaults } from '@hooks/useUserDeployedVaults'

interface DeployedVaultCardProps {
  vault: Vault
  className?: string
}

export const DeployedVaultCard = (props: DeployedVaultCardProps) => {
  const { vault, className } = props

  return (
    <div
      className={classNames(
        'w-full max-w-sm flex flex-col gap-2 px-6 py-4 bg-pt-transparent/20 rounded-3xl',
        className
      )}
    >
      <VaultNameItem vault={vault} />
      <VaultCardRow name='Address' data={<VaultAddressItem vault={vault} />} />
      <VaultCardRow name='Liquidation Pair' data={<VaultLiquidationPairItem vault={vault} />} />
      <VaultCardRow name='Claimer' data={<VaultClaimerItem vault={vault} />} />
      <VaultCardRow name='Status' data={<VaultStatusItem vault={vault} />} />
      <VaultActionsItem vault={vault} />
    </div>
  )
}

interface VaultCardRowProps {
  name: ReactNode
  data: ReactNode
  className?: string
}

const VaultCardRow = (props: VaultCardRowProps) => {
  const { name, data, className } = props

  return (
    <div className={classNames('inline-flex w-full items-center justify-between', className)}>
      <span className='text-pt-purple-300'>{name}</span>
      <span>{data}</span>
    </div>
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
    return <Spinner />
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
    return <Spinner />
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

  return <Spinner />
}

// TODO: add claim fees button if vault fees are available to claim
const VaultActionsItem = (props: ItemProps) => {
  const { vault } = props

  const router = useRouter()

  const { address } = useAccount()

  const { data: vaultOwner } = useVaultOwner(vault)

  const { setStep: setLpStep } = useLiquidationPairSteps()

  const { removeVault } = useUserDeployedVaults()

  const onClickSetLp = () => {
    setLpStep(0)
    router.push(`/lp/${vault.chainId}/${vault.address}`)
  }

  const onClickSetClaimer = () => {
    router.push(`/claimer/${vault.chainId}/${vault.address}`)
  }

  const onClickRemoveVault = () => {
    removeVault(vault)
  }

  const isVaultOwner =
    !!vaultOwner && !!address && vaultOwner.toLowerCase() === address.toLowerCase()

  const iconClassName = 'h-6 w-6 text-pt-purple-300 cursor-pointer'
  const ownerOnlyIconClassName = classNames(iconClassName, {
    'cursor-default opacity-50': !isVaultOwner
  })

  return (
    <div className='flex gap-1 items-center mt-3'>
      <ArrowPathRoundedSquareIcon
        onClick={isVaultOwner ? onClickSetLp : undefined}
        className={ownerOnlyIconClassName}
      />
      <WrenchIcon
        onClick={isVaultOwner ? onClickSetClaimer : undefined}
        className={ownerOnlyIconClassName}
      />
      <TrashIcon onClick={onClickRemoveVault} className={classNames('ml-auto', iconClassName)} />
    </div>
  )
}
