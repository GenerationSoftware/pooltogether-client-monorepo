import { NetworkIcon, TokenIcon } from '@shared/react-components'
import { Token } from '@shared/types'
import classNames from 'classnames'
import { useMemo } from 'react'
import { SupportedNetwork, V3_POOLS, V4_POOLS } from '@constants/config'
import { SimpleBadge } from './SimpleBadge'

export interface TokenBadgeProps {
  token: Token
  className?: string
}

export const TokenBadge = (props: TokenBadgeProps) => {
  const { token, className } = props

  const ticket = useMemo(() => {
    const v4Ticket =
      V4_POOLS[token.chainId]?.ticket.address === token.address.toLowerCase()
        ? V4_POOLS[token.chainId].ticket
        : undefined

    if (!!v4Ticket) return v4Ticket

    const v3UnderlyingTokenAddress = V3_POOLS[token.chainId as SupportedNetwork]?.find(
      (pool) =>
        pool.ticketAddress === token.address.toLowerCase() ||
        pool.podAddress === token.address.toLowerCase()
    )?.tokenAddress

    const v3Ticket = !!v3UnderlyingTokenAddress
      ? { ...token, address: v3UnderlyingTokenAddress }
      : undefined

    if (!!v3Ticket) return v3Ticket

    return token
  }, [token])

  return (
    <SimpleBadge className={classNames('gap-2', className)}>
      <div className='relative pb-1 shrink-0'>
        <TokenIcon token={ticket} />
        <NetworkIcon chainId={token.chainId} className='absolute top-3 left-3 h-4 w-4' />
      </div>
      <span className='text-sm font-medium overflow-hidden overflow-ellipsis'>{ticket.name}</span>
      <span className='text-xs text-pt-purple-200'>{ticket.symbol}</span>
    </SimpleBadge>
  )
}
