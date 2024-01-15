import { NetworkIcon, TokenIcon } from '@shared/react-components'
import { Token } from '@shared/types'
import classNames from 'classnames'
import { V4_POOLS } from '@constants/config'
import { SimpleBadge } from './SimpleBadge'

export interface TokenBadgeProps {
  token: Token
  className?: string
}

export const TokenBadge = (props: TokenBadgeProps) => {
  const { token, className } = props

  const v4Ticket =
    V4_POOLS[token.chainId]?.ticket.address === token.address.toLowerCase()
      ? V4_POOLS[token.chainId].ticket
      : undefined

  return (
    <SimpleBadge className={classNames('gap-2', className)}>
      <div className='relative pb-1 shrink-0'>
        <TokenIcon token={v4Ticket ?? token} />
        <NetworkIcon chainId={token.chainId} className='absolute top-3 left-3 h-4 w-4' />
      </div>
      <span className='text-sm font-medium overflow-hidden overflow-ellipsis'>
        {v4Ticket?.name ?? token.name}
      </span>
      <span className='text-xs text-pt-purple-200'>{v4Ticket?.symbol ?? token.symbol}</span>
    </SimpleBadge>
  )
}
