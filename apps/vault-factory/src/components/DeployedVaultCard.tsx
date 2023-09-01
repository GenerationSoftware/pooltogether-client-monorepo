import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useVaultClaimer,
  useVaultLiquidationPair
} from '@generationsoftware/hyperstructure-react-hooks'
import { VaultBadge } from '@shared/react-components'
import { Button, LINKS, Spinner } from '@shared/ui'
import { getBlockExplorerUrl, shorten } from '@shared/utilities'
import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { VaultState } from 'src/types'
import { zeroAddress } from 'viem'
import { useDeployedVaultState } from '@hooks/useDeployedVaultState'
import { useLiquidationPairSteps } from '@hooks/useLiquidationPairSteps'

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

  return <Spinner />
}

const VaultActionsItem = (props: ItemProps) => {
  const { vault } = props

  const router = useRouter()

  const { vaultState } = useDeployedVaultState(vault)

  const { setStep: setLpStep } = useLiquidationPairSteps()

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
