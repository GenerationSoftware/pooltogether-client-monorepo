import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useLiquidationEvents,
  useTokenPrices,
  useTxReceipt
} from '@generationsoftware/hyperstructure-react-hooks'
import { Button, ExternalLink, Spinner } from '@shared/ui'
import {
  DOLPHIN_ADDRESS,
  formatNumberForDisplay,
  getBlockExplorerUrl,
  shorten
} from '@shared/utilities'
import classNames from 'classnames'
import { ReactNode, useState } from 'react'
import { getTxGasSpent } from 'src/utils'
import { Address, formatEther, formatUnits } from 'viem'
import { useLiquidationPairTokenInPrice } from '@hooks/useLiquidationPairTokenInPrice'
import { useLiquidationPairTokenOutPrice } from '@hooks/useLiquidationPairTokenOutPrice'

interface LiquidationTxsDropdownProps {
  prizePool: PrizePool
  lpAddress: Address
  liquidations: NonNullable<ReturnType<typeof useLiquidationEvents>['data']>
  className?: string
}

export const LiquidationTxsDropdown = (props: LiquidationTxsDropdownProps) => {
  const { prizePool, lpAddress, liquidations, className } = props

  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={classNames('w-full flex flex-col gap-3 text-sm', className)}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        color='purple'
        className='bg-pt-purple-500 border-pt-purple-500 hover:bg-pt-purple-600 focus:outline-transparent'
      >
        <span className='text-pt-purple-100 whitespace-nowrap'>
          {isOpen ? 'Hide' : 'Show'} {liquidations.length} Liquidation Transaction
          {liquidations.length === 1 ? '' : 's'}
        </span>
      </Button>
      {isOpen &&
        liquidations.map((liquidation) => (
          <LiquidationTx
            chainId={prizePool.chainId}
            lpAddress={lpAddress}
            liquidation={liquidation}
            key={`liqTx-${liquidation.transactionHash}-${liquidation.logIndex}`}
          />
        ))}
    </div>
  )
}

interface LiquidationTxProps {
  chainId: number
  lpAddress: Address
  liquidation: NonNullable<ReturnType<typeof useLiquidationEvents>['data']>[0]
  className?: string
}

const LiquidationTx = (props: LiquidationTxProps) => {
  const { chainId, lpAddress, liquidation, className } = props

  const { data: tokenIn } = useLiquidationPairTokenInPrice(chainId, lpAddress)
  const { data: tokenOut } = useLiquidationPairTokenOutPrice(chainId, lpAddress)

  const { data: txReceipt } = useTxReceipt(chainId, liquidation.transactionHash)

  const { data: tokenPrices } = useTokenPrices(chainId, [DOLPHIN_ADDRESS])

  if (!tokenIn || !tokenOut || !txReceipt || !tokenPrices) {
    return <Spinner className='after:border-y-pt-purple-300' />
  }

  const tokenInAmount = parseFloat(formatUnits(liquidation.args.amountIn, tokenIn.decimals))
  const tokenOutAmount = parseFloat(formatUnits(liquidation.args.amountOut, tokenOut.decimals))

  const tokenInValue = !!tokenIn.price ? tokenInAmount * tokenIn.price : undefined
  const tokenOutValue = !!tokenOut.price ? tokenOutAmount * tokenOut.price : undefined
  const gasValue = parseFloat(formatEther(getTxGasSpent(txReceipt))) * tokenPrices[DOLPHIN_ADDRESS]
  const profit =
    !!tokenInValue && !!tokenOutValue
      ? (tokenOutValue / (tokenInValue + gasValue) - 1) * 100
      : undefined

  const formattedTokenInAmount = formatNumberForDisplay(tokenInAmount, {
    maximumSignificantDigits: 3
  })
  const formattedTokenOutAmount = formatNumberForDisplay(tokenOutAmount, {
    maximumSignificantDigits: 3
  })

  const Highlight = (props: { children: ReactNode }) => (
    <span className='font-medium'>{props.children}</span>
  )

  return (
    <div
      className={classNames(
        'flex flex-col gap-2 items-center justify-center py-1 px-4 text-center bg-pt-transparent rounded md:flex-row',
        className
      )}
    >
      <span>
        <Highlight>
          <a href={getBlockExplorerUrl(chainId, liquidation.args.sender)} target='_blank'>
            {shorten(liquidation.args.sender)}
          </a>
        </Highlight>{' '}
        liquidated{' '}
        <Highlight>
          {formattedTokenOutAmount} {tokenOut.symbol}
        </Highlight>{' '}
        for{' '}
        <Highlight>
          {formattedTokenInAmount} {tokenIn.symbol}
        </Highlight>{' '}
        {profit !== undefined && (
          <span>({formatNumberForDisplay(profit, { maximumFractionDigits: 1 })}% profit)</span>
        )}
      </span>
      <ExternalLink
        href={getBlockExplorerUrl(chainId, liquidation.transactionHash, 'tx')}
        size='sm'
        className='text-blue-400'
      >
        See TX
      </ExternalLink>
    </div>
  )
}
