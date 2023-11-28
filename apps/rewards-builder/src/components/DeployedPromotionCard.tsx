import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useToken } from '@generationsoftware/hyperstructure-react-hooks'
import { TokenIcon, VaultBadge } from '@shared/react-components'
import { LINKS, Spinner } from '@shared/ui'
import {
  getBlockExplorerUrl,
  getSecondsSinceEpoch,
  getSimpleDate,
  isTestnet,
  shorten
} from '@shared/utilities'
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
        name='Token'
        data={<TokenItem token={{ chainId: promotion.chainId, address: promotion.token }} />}
      />
      <CardRow
        name='Owner'
        data={
          <AddressItem chainId={promotion.chainId} address={promotion.creator ?? zeroAddress} />
        }
      />
      <CardRow
        name='Status'
        data={
          <StatusItem
            startTimestamp={Number(promotion.startTimestamp)}
            epochDuration={promotion.epochDuration}
            numberOfEpochs={promotion.numberOfEpochs}
          />
        }
      />
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
    <Link
      href={`${LINKS.app}/vault/${vault.chainId}/${vault.address}`}
      target='_blank'
      className='inline-flex items-center justify-between'
    >
      <VaultBadge vault={vault} onClick={() => {}} symbolClassName='hidden' />
      {isTestnet(vault.chainId) && <span className='text-xs text-pt-warning-light'>TESTNET</span>}
    </Link>
  )
}

const TokenItem = (props: { token: { chainId: number; address: Address } }) => {
  const { token } = props

  const { data: tokenData } = useToken(token.chainId, token.address)

  if (!tokenData) {
    return <Spinner />
  }

  return (
    <span className='inline-flex gap-2 items-center'>
      <TokenIcon token={tokenData} />
      {tokenData.symbol}
    </span>
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

const StatusItem = (props: {
  startTimestamp: number
  epochDuration: number
  numberOfEpochs?: number
}) => {
  const { startTimestamp, epochDuration, numberOfEpochs } = props

  const currentTimestamp = getSecondsSinceEpoch()
  const promotionEndsAt = !!numberOfEpochs
    ? startTimestamp + numberOfEpochs * epochDuration
    : undefined

  if (!!promotionEndsAt && promotionEndsAt > currentTimestamp) {
    return (
      <span className='text-sm text-pt-purple-300'>
        active (ends {getSimpleDate(promotionEndsAt)})
      </span>
    )
  } else {
    return <span className='text-sm text-pt-warning-light'>ended</span>
  }
}

const ActionsItem = (props: {}) => {
  const {} = props

  const router = useRouter()

  const { address } = useAccount()

  // TODO: add extend and destroy functionality if user is promotion owner

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
