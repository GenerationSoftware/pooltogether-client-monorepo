import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useToken } from '@generationsoftware/hyperstructure-react-hooks'
import {
  ArchiveBoxXMarkIcon,
  ArrowRightOnRectangleIcon,
  SquaresPlusIcon
} from '@heroicons/react/24/outline'
import { TokenIcon, VaultBadge } from '@shared/react-components'
import { LINKS, Spinner, Tooltip } from '@shared/ui'
import { getBlockExplorerUrl, getSimpleDate, isTestnet, shorten } from '@shared/utilities'
import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { Promotion } from 'src/types'
import { Address, zeroAddress } from 'viem'
import { useAccount } from 'wagmi'
import { usePromotionStatus } from '@hooks/usePromotionStatus'

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
      <CardRow name='Status' data={<StatusItem promotion={promotion} />} />
      <CardRow name='Actions' data={<ActionsItem promotion={promotion} />} />
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

const StatusItem = (props: { promotion: Promotion }) => {
  const { promotion } = props

  const { status, endsAt } = usePromotionStatus(promotion)

  if (status === 'active') {
    return (
      <span className='text-sm text-pt-purple-300'>
        active{!!endsAt ? ` (ends ${getSimpleDate(endsAt)})` : ''}
      </span>
    )
  } else if (status === 'ended') {
    return <span className='text-sm text-pt-warning-light'>ended</span>
  } else if (status === 'destroyed') {
    return <span className='text-sm text-pt-warning-light'>destroyed</span>
  } else {
    return <>?</>
  }
}

const ActionsItem = (props: { promotion: Promotion }) => {
  const { promotion } = props

  const router = useRouter()

  const { address } = useAccount()

  const { status, canDestroy } = usePromotionStatus(promotion)

  const isPromotionOwner =
    !!promotion?.creator && !!address && promotion.creator.toLowerCase() === address.toLowerCase()

  const onClickExtend = () => {
    router.push(`/extend/${promotion.chainId}/${promotion.id}`)
  }

  const onClickEnd = () => {
    router.push(`/end/${promotion.chainId}/${promotion.id}`)
  }

  const onClickDestroy = () => {
    router.push(`/destroy/${promotion.chainId}/${promotion.id}`)
  }

  const iconClassName = 'h-6 w-6 text-pt-purple-300 cursor-pointer'

  if (isPromotionOwner) {
    return (
      <div className='flex gap-1 items-center'>
        {status === 'active' && (
          <>
            <Tooltip content='Extend Promotion'>
              <SquaresPlusIcon
                onClick={onClickExtend}
                className={classNames(iconClassName, {
                  'cursor-default opacity-50': !isPromotionOwner
                })}
              />
            </Tooltip>
            <Tooltip content='End Promotion Early'>
              <ArrowRightOnRectangleIcon
                onClick={onClickEnd}
                className={classNames(iconClassName, {
                  'cursor-default opacity-50': !isPromotionOwner
                })}
              />
            </Tooltip>
          </>
        )}
        {status === 'ended' && (
          <Tooltip content='Destroy Promotion'>
            <ArchiveBoxXMarkIcon
              onClick={onClickDestroy}
              className={classNames(iconClassName, {
                'cursor-default opacity-50': !isPromotionOwner || !canDestroy
              })}
            />
          </Tooltip>
        )}
      </div>
    )
  } else {
    return <></>
  }
}
