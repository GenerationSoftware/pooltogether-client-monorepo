import { useToken } from '@generationsoftware/hyperstructure-react-hooks'
import { NetworkIcon, TokenIcon } from '@shared/react-components'
import classNames from 'classnames'
import { LiquidationPair } from 'src/types'
import { Address } from 'viem'

export interface LpBadgeProps {
  liquidationPair: LiquidationPair
  className?: string
  iconClassName?: string
  textClassName?: string
  onClick?: () => void
}

export const LpBadge = (props: LpBadgeProps) => {
  const { liquidationPair, className, iconClassName, textClassName, onClick } = props

  const { data: tokenOut } = useToken(liquidationPair?.chainId, liquidationPair.swapPath[0])
  const { data: tokenIn } = useToken(
    liquidationPair?.chainId,
    liquidationPair.swapPath[liquidationPair.swapPath.length - 1] as Address
  )

  return (
    <div
      className={classNames(
        'inline-flex items-center gap-2 shrink-0 px-3 py-2 bg-pt-transparent rounded-lg',
        'whitespace-nowrap overflow-hidden',
        'border border-pt-transparent',
        { 'cursor-pointer select-none hover:bg-pt-purple-50/20': !!onClick },
        className
      )}
      onClick={onClick}
    >
      <div className={classNames('relative pb-1 shrink-0', iconClassName)}>
        <TokenIcon token={{ chainId: liquidationPair.chainId, address: tokenOut?.address }} />
        <NetworkIcon chainId={liquidationPair.chainId} className='absolute top-3 left-3 h-4 w-4' />
      </div>
      <span className={classNames('text-sm overflow-hidden overflow-ellipsis', textClassName)}>
        <span className='font-medium'>{tokenOut?.symbol}</span> /{' '}
        <span className='text-pt-purple-200'>{tokenIn?.symbol}</span>
      </span>
    </div>
  )
}
