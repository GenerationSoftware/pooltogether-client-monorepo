import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { VaultBadge } from '@shared/react-components'
import { LINKS, Spinner } from '@shared/ui'
import { getBlockExplorerUrl, shorten } from '@shared/utilities'
import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { Promotion } from 'src/types'
import { Address, zeroAddress } from 'viem'
import { useAccount } from 'wagmi'

interface DeployedPromotionCardProps {
  promotion: Promotion
  className?: string
}

export const DeployedPromotionCard = (props: DeployedPromotionCardProps) => {
  const { promotion, className } = props

  return (
    <div
      className={classNames(
        'w-full max-w-sm flex flex-col gap-2 px-6 py-4 bg-pt-transparent/20 rounded-3xl',
        className
      )}
    >
      <VaultItem vault={promotion.vault} />
      <CardRow
        name='Owner'
        data={
          <AddressItem chainId={promotion.chainId} address={promotion.creator ?? zeroAddress} />
        }
      />
      <CardRow name='Status' data={<StatusItem />} />
      <ActionsItem />
    </div>
  )
}

interface CardRowProps {
  name: ReactNode
  data: ReactNode
  className?: string
}

const CardRow = (props: CardRowProps) => {
  const { name, data, className } = props

  return (
    <div className={classNames('inline-flex w-full items-center justify-between', className)}>
      <span className='text-pt-purple-300'>{name}</span>
      <span>{data}</span>
    </div>
  )
}

const VaultItem = (props: { vault: Vault }) => {
  const { vault } = props

  return (
    <Link href={`${LINKS.app}/vault/${vault.chainId}/${vault.address}`} target='_blank'>
      <VaultBadge vault={vault} onClick={() => {}} symbolClassName='hidden' />
    </Link>
  )
}

const AddressItem = (props: { chainId: number; address: Address }) => {
  const { chainId, address } = props

  if (address === zeroAddress) {
    return <>?</>
  }

  return (
    <a href={getBlockExplorerUrl(chainId, address)} target='_blank'>
      {shorten(address)}
    </a>
  )
}

const StatusItem = (props: {}) => {
  const {} = props

  // TODO

  // if (vaultState === 'invalid') {
  //   return <span className='text-sm text-pt-warning-light'>invalid</span>
  // }

  // if (vaultState === 'missingLiquidationPair' || vaultState === 'missingClaimer') {
  //   return <span className='text-sm text-pt-warning-light'>incomplete</span>
  // }

  // if (vaultState === 'active') {
  //   return <span className='text-sm text-pt-purple-300'>active</span>
  // }

  return <Spinner />
}

const ActionsItem = (props: {}) => {
  const {} = props

  const router = useRouter()

  const { address } = useAccount()

  // TODO

  // const { data: vaultOwner } = useVaultOwner(vault)

  // const { setStep: setLpStep } = useLiquidationPairSteps()

  // const { removeVault } = useDeployedVaults()

  // const onClickDeployLp = () => {
  //   setLpStep(0)
  //   router.push(`/lp/${vault.chainId}/${vault.address}`)
  // }

  // const onClickSetClaimer = () => {
  //   router.push(`/claimer/${vault.chainId}/${vault.address}`)
  // }

  // const onClickRemoveVault = () => {
  //   removeVault(vault)
  // }

  // const isVaultOwner =
  //   !!vaultOwner && !!address && vaultOwner.toLowerCase() === address.toLowerCase()

  // const iconClassName = 'h-6 w-6 text-pt-purple-300 cursor-pointer'
  // const ownerOnlyIconClassName = classNames(iconClassName, {
  //   'cursor-auto opacity-50': !isVaultOwner
  // })

  // return (
  //   <div className='flex gap-1 items-center mt-3'>
  //     <ArrowPathRoundedSquareIcon
  //       onClick={isVaultOwner ? onClickDeployLp : undefined}
  //       className={ownerOnlyIconClassName}
  //     />
  //     <WrenchIcon
  //       onClick={isVaultOwner ? onClickSetClaimer : undefined}
  //       className={ownerOnlyIconClassName}
  //     />
  //     <TrashIcon onClick={onClickRemoveVault} className={classNames('ml-auto', iconClassName)} />
  //   </div>
  // )

  return <></>
}
