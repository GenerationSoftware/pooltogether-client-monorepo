import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { useTokenPrices } from '@generationsoftware/hyperstructure-react-hooks'
import { TokenWithPrice } from '@shared/types'
import { Button, ExternalLink, Spinner } from '@shared/ui'
import {
  formatNumberForDisplay,
  getBlockExplorerUrl,
  NULL_ADDRESS,
  shorten
} from '@shared/utilities'
import classNames from 'classnames'
import { ReactNode, useState } from 'react'
import { getTxGasSpent } from 'src/utils'
import { Address, formatEther, formatUnits } from 'viem'
import { useLiquidationEvents } from '@hooks/useLiquidationEvents'
import { useLiquidationPairTokenOutPrice } from '@hooks/useLiquidationPairTokenOutPrice'
import { useTxReceipt } from '@hooks/useTxReceipt'

interface LiquidationTxsDropdownProps {
  prizePool: PrizePool
  lpAddress: Address
  liquidations: NonNullable<ReturnType<typeof useLiquidationEvents>['data']>
  prizeToken: TokenWithPrice
  className?: string
}

export const LiquidationTxsDropdown = (props: LiquidationTxsDropdownProps) => {
  const { prizePool, lpAddress, liquidations, prizeToken, className } = props

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
            prizeToken={prizeToken}
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
  prizeToken: TokenWithPrice
  className?: string
}

const LiquidationTx = (props: LiquidationTxProps) => {
  const { chainId, lpAddress, liquidation, prizeToken, className } = props

  const { data: lpToken } = useLiquidationPairTokenOutPrice(chainId, lpAddress)

  const { data: txReceipt } = useTxReceipt(chainId, liquidation.transactionHash)

  const { data: tokenPrices } = useTokenPrices(chainId, [NULL_ADDRESS])

  if (!lpToken || !txReceipt || !tokenPrices) {
    return <Spinner className='after:border-y-pt-purple-800' />
  }

  const tokenInAmount = parseFloat(formatUnits(liquidation.args.amountIn, prizeToken.decimals))
  const tokenOutAmount = parseFloat(formatUnits(liquidation.args.amountOut, lpToken.decimals))

  const tokenInValue = !!prizeToken.price ? tokenInAmount * prizeToken.price : undefined
  const tokenOutValue = !!lpToken.price ? tokenOutAmount * lpToken.price : undefined
  const gasValue = parseFloat(formatEther(getTxGasSpent(txReceipt))) * tokenPrices[NULL_ADDRESS]
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
        'flex flex-col gap-2 items-center justify-center py-1 px-4 text-center bg-pt-purple-50 rounded md:flex-row',
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
          {formattedTokenOutAmount} {lpToken.symbol}
        </Highlight>{' '}
        for{' '}
        <Highlight>
          {formattedTokenInAmount} {prizeToken.symbol}
        </Highlight>{' '}
        {profit !== undefined && (
          <span>({formatNumberForDisplay(profit, { maximumFractionDigits: 1 })}% profit)</span>
        )}
      </span>
      <ExternalLink
        href={getBlockExplorerUrl(chainId, liquidation.transactionHash, 'tx')}
        size='sm'
        className='text-blue-600'
      >
        See TX
      </ExternalLink>
    </div>
  )
}
