import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { usePublicClientsByChain, useToken } from '@generationsoftware/hyperstructure-react-hooks'
import {
  ArchiveBoxXMarkIcon,
  ArrowRightOnRectangleIcon,
  SquaresPlusIcon
} from '@heroicons/react/24/outline'
import { useScreenSize } from '@shared/generic-react-hooks'
import { TokenIcon, VaultBadge } from '@shared/react-components'
import { LINKS, Spinner, Table, TableData, Tooltip } from '@shared/ui'
import { getBlockExplorerUrl, getSimpleDate, isTestnet, shorten } from '@shared/utilities'
import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { Promotion } from 'src/types'
import { Address, zeroAddress } from 'viem'
import { useAccount } from 'wagmi'
import { SUPPORTED_NETWORKS } from '@constants/config'
import { useAllPromotions } from '@hooks/useAllPromotions'
import { usePromotionStatus } from '@hooks/usePromotionStatus'
import { DeployedPromotionCard } from './DeployedPromotionCard'

interface DeployedPromotionsTableProps {
  onlyUser?: Address
  filterOutUser?: Address
  className?: string
}

export const DeployedPromotionsTable = (props: DeployedPromotionsTableProps) => {
  const { onlyUser, filterOutUser, className } = props

  const publicClients = usePublicClientsByChain({ useAll: true })

  const { data: allPromotions, isFetched: isFetchedAllPromotions } = useAllPromotions()

  const promotionsArray = useMemo(() => {
    const array: Promotion[] = []

    SUPPORTED_NETWORKS.forEach((chainId) => {
      if (!!allPromotions[chainId]) {
        Object.entries(allPromotions[chainId]).forEach(([id, info]) => {
          if (
            (!onlyUser && !filterOutUser) ||
            (!!onlyUser &&
              !!info.creator &&
              onlyUser.toLowerCase() === info.creator.toLowerCase()) ||
            (!!filterOutUser &&
              !!info.creator &&
              filterOutUser.toLowerCase() !== info.creator.toLowerCase())
          ) {
            const vault = new Vault(chainId, info.vault, publicClients[chainId])
            array.push({ chainId, id: parseInt(id), ...info, vault })
          }
        })
      }
    })

    return array.sort((a, b) => Number(b.startTimestamp - a.startTimestamp))
  }, [allPromotions])

  const { width: screenWidth } = useScreenSize()
  const isMobile = !!screenWidth && screenWidth < 1024

  const tableData: TableData = {
    headers: {
      vault: { content: 'Vault' },
      token: { content: 'Token', position: 'center' },
      owner: { content: 'Owner', position: 'center' },
      status: { content: 'Status', position: 'center' },
      actions: { content: 'Actions', position: 'center' }
    },
    rows: promotionsArray.map((promotion) => ({
      id: `${promotion.chainId}-${promotion.id}`,
      cells: {
        vault: {
          content: <VaultItem vault={promotion.vault} />
        },
        token: {
          content: <TokenItem token={{ chainId: promotion.chainId, address: promotion.token }} />,
          position: 'center'
        },
        owner: {
          content: (
            <AddressItem chainId={promotion.chainId} address={promotion.creator ?? zeroAddress} />
          ),
          position: 'center'
        },
        status: {
          content: <StatusItem promotion={promotion} />,
          position: 'center'
        },
        actions: {
          content: !!onlyUser ? <ActionsItem promotion={promotion} /> : <></>,
          position: 'center'
        }
      }
    }))
  }

  if (!isFetchedAllPromotions) {
    return <Spinner />
  }

  if (tableData.rows.length === 0) {
    return <span className={classNames('text-pt-purple-200', className)}>None.</span>
  }

  if (isMobile) {
    return (
      <div className='w-full flex flex-col gap-4 items-center'>
        {promotionsArray.map((promotion) => (
          <DeployedPromotionCard
            key={`deployedPromotion-${promotion.chainId}-${promotion.id}`}
            promotion={promotion}
          />
        ))}
      </div>
    )
  }

  return (
    <Table
      keyPrefix='deployedPromotionsTable'
      data={tableData}
      className={classNames('w-full px-6 pb-6 bg-pt-transparent/20 rounded-3xl', className)}
      innerClassName='overflow-y-auto'
      headerClassName='text-center font-medium text-pt-purple-300 whitespace-nowrap'
      rowClassName='text-sm font-medium rounded-lg overflow-hidden'
      gridColsClassName={`grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]`}
    />
  )
}

const VaultItem = (props: { vault: Vault }) => {
  const { vault } = props

  return (
    <Link
      href={`${LINKS.app}/vault/${vault.chainId}/${vault.address}`}
      target='_blank'
      className='relative'
    >
      <VaultBadge vault={vault} onClick={() => {}} symbolClassName='hidden' />
      {isTestnet(vault.chainId) && (
        <span className='absolute right-1 bottom-0 text-[.6em] leading-4 text-pt-warning-light'>
          TESTNET
        </span>
      )}
    </Link>
  )
}

const TokenItem = (props: { token: { chainId: number; address: Address } }) => {
  const { token } = props

  const { data: tokenData } = useToken(token.chainId, token.address)

  if (!tokenData) {
    return <WrappedSpinner />
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

  return (
    <div className='flex gap-1 items-center'>
      {status === 'active' && (
        <>
          <Tooltip content='Extend Promotion'>
            <SquaresPlusIcon
              onClick={isPromotionOwner ? onClickExtend : undefined}
              className={classNames(iconClassName, {
                'cursor-default opacity-50': !isPromotionOwner
              })}
            />
          </Tooltip>
          <Tooltip content='End Promotion Early'>
            <ArrowRightOnRectangleIcon
              onClick={isPromotionOwner ? onClickEnd : undefined}
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
            onClick={isPromotionOwner && canDestroy ? onClickDestroy : undefined}
            className={classNames(iconClassName, {
              'cursor-default opacity-50': !isPromotionOwner || !canDestroy
            })}
          />
        </Tooltip>
      )}
    </div>
  )
}

// NOTE: This is wrapped to avoid table overflow on spinner animation
const WrappedSpinner = () => {
  return (
    <div className='h-5 w-5 relative'>
      <Spinner className='absolute' />
    </div>
  )
}
