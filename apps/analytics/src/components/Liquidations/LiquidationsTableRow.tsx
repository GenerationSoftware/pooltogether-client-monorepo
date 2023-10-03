import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { useTokenPrices } from '@generationsoftware/hyperstructure-react-hooks'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Token, TokenWithPrice } from '@shared/types'
import { ExternalLink, Spinner } from '@shared/ui'
import {
  calculatePercentageOfBigInt,
  formatBigIntForDisplay,
  formatNumberForDisplay,
  getBlockExplorerUrl,
  NULL_ADDRESS
} from '@shared/utilities'
import classNames from 'classnames'
import { ReactNode, useMemo } from 'react'
import { Address, formatEther, formatUnits, hexToBigInt, TransactionReceipt } from 'viem'
import { useLiquidationEvents } from '@hooks/useLiquidationEvents'
import { useLiquidationPairLiquidatableBalance } from '@hooks/useLiquidationPairLiquidatableBalance'
import { useLiquidationPairTokenOutData } from '@hooks/useLiquidationPairTokenOutData'
import { useLiquidationPairTokenOutPrice } from '@hooks/useLiquidationPairTokenOutPrice'
import { useTxReceipts } from '@hooks/useTxReceipts'
import { liquidationHeaders } from './LiquidationsTable'

interface LiquidationsTableRowProps {
  prizePool: PrizePool
  lpAddress: Address
  liquidations: NonNullable<ReturnType<typeof useLiquidationEvents>['data']>
  prizeToken: TokenWithPrice
  className?: string
}

export const LiquidationsTableRow = (props: LiquidationsTableRowProps) => {
  const { prizePool, lpAddress, liquidations, prizeToken, className } = props

  const lpLiquidations = liquidations.filter(
    (liq) => liq.args.liquidationPair.toLowerCase() === lpAddress.toLowerCase()
  )

  return (
    <div className={classNames('py-3 text-sm bg-pt-purple-100/50 rounded-xl', className)}>
      <LiquidationPairLink
        chainId={prizePool.chainId}
        lpAddress={lpAddress}
        prizeToken={prizeToken}
        className='w-full md:w-auto'
      />
      <YieldAuctioned
        chainId={prizePool.chainId}
        lpAddress={lpAddress}
        liquidations={lpLiquidations}
        className='w-1/2 md:w-auto'
      />
      <AvgLiquidationPrice
        chainId={prizePool.chainId}
        lpAddress={lpAddress}
        liquidations={lpLiquidations}
        prizeToken={prizeToken}
        className='w-1/2 md:w-auto'
      />
      <CurrentAvailableYield
        chainId={prizePool.chainId}
        lpAddress={lpAddress}
        className='w-1/2 md:w-auto'
      />
      <AvgEfficiency
        chainId={prizePool.chainId}
        lpAddress={lpAddress}
        liquidations={lpLiquidations}
        prizeToken={prizeToken}
        className='w-1/2 md:w-auto'
      />
    </div>
  )
}

interface LiquidationPairLinkProps {
  chainId: number
  lpAddress: Address
  prizeToken: Token
  className?: string
}

const LiquidationPairLink = (props: LiquidationPairLinkProps) => {
  const { chainId, lpAddress, prizeToken, className } = props

  const { data: lpToken } = useLiquidationPairTokenOutData(chainId, lpAddress)

  if (!lpToken) {
    return <Spinner className='after:border-y-pt-purple-800' />
  }

  return (
    <ExternalLink
      href={getBlockExplorerUrl(chainId, lpAddress)}
      className={classNames('text-xl font-semibold', className)}
      iconClassName='text-pt-purple-400'
    >
      {lpToken.symbol ?? '?'}/{prizeToken.symbol}
    </ExternalLink>
  )
}

interface YieldAuctionedProps {
  chainId: number
  lpAddress: Address
  liquidations: LiquidationsTableRowProps['liquidations']
  className?: string
}

const YieldAuctioned = (props: YieldAuctionedProps) => {
  const { chainId, lpAddress, liquidations, className } = props

  const { data: lpToken } = useLiquidationPairTokenOutData(chainId, lpAddress)

  if (!lpToken) {
    return <Spinner className='after:border-y-pt-purple-800' />
  }

  const totalYieldAuctioned = liquidations.reduce((a, b) => a + b.args.amountOut, 0n)

  return (
    <div className={classNames('flex flex-col gap-3 text-sm', className)}>
      <span className='text-pt-purple-500 md:hidden'>{liquidationHeaders.auctioned}</span>
      <span>
        <span className='text-xl font-semibold'>
          {formatBigIntForDisplay(totalYieldAuctioned, lpToken.decimals, { hideZeroes: true })}
        </span>{' '}
        {lpToken.symbol}
      </span>
    </div>
  )
}

interface AvgLiquidationPriceProps {
  chainId: number
  lpAddress: Address
  liquidations: LiquidationsTableRowProps['liquidations']
  prizeToken: Token
  className?: string
}

const AvgLiquidationPrice = (props: AvgLiquidationPriceProps) => {
  const { chainId, lpAddress, liquidations, prizeToken, className } = props

  const { data: lpToken } = useLiquidationPairTokenOutData(chainId, lpAddress)

  const avgPrice = useMemo(() => {
    if (!!lpToken) {
      if (!liquidations.length) return 0
      const avgAmountIn =
        parseFloat(
          formatUnits(
            liquidations.reduce((a, b) => a + b.args.amountIn, 0n),
            prizeToken.decimals
          )
        ) / liquidations.length
      const avgAmountOut =
        parseFloat(
          formatUnits(
            liquidations.reduce((a, b) => a + b.args.amountOut, 0n),
            lpToken.decimals
          )
        ) / liquidations.length
      return avgAmountIn / avgAmountOut
    }
  }, [liquidations, lpToken])

  return (
    <div className={classNames('flex flex-col gap-3 text-sm', className)}>
      <span className='text-pt-purple-500 md:hidden'>{liquidationHeaders.price}</span>
      <span className='whitespace-nowrap'>
        {!!lpToken && !!avgPrice ? (
          <>
            <span className='text-xl font-semibold'>1</span> {lpToken.symbol} ={' '}
            <span className='text-xl font-semibold'>
              {formatNumberForDisplay(
                avgPrice,
                avgPrice > 100 ? { hideZeroes: true } : { maximumFractionDigits: 2 }
              )}
            </span>{' '}
            {prizeToken.symbol}
          </>
        ) : (
          <Spinner className='after:border-y-pt-purple-800' />
        )}
      </span>
    </div>
  )
}

interface CurrentAvailableYieldProps {
  chainId: number
  lpAddress: Address
  className?: string
}

const CurrentAvailableYield = (props: CurrentAvailableYieldProps) => {
  const { chainId, lpAddress, className } = props

  const { data: liquidatableBalance } = useLiquidationPairLiquidatableBalance(chainId, lpAddress)

  const { data: lpToken } = useLiquidationPairTokenOutData(chainId, lpAddress)

  if (liquidatableBalance === undefined || !lpToken) {
    return <Spinner className='after:border-y-pt-purple-800' />
  }

  return (
    <div className={classNames('flex flex-col gap-3 text-sm', className)}>
      <span className='text-pt-purple-500 md:hidden'>{liquidationHeaders.available}</span>
      <span>
        <span className='text-xl font-semibold'>
          {formatBigIntForDisplay(liquidatableBalance, lpToken.decimals, { hideZeroes: true })}
        </span>{' '}
        {lpToken.symbol}
      </span>
    </div>
  )
}

interface AvgEfficiencyProps {
  chainId: number
  lpAddress: Address
  liquidations: LiquidationsTableRowProps['liquidations']
  prizeToken: TokenWithPrice
  className?: string
}

const AvgEfficiency = (props: AvgEfficiencyProps) => {
  const { chainId, lpAddress, liquidations, prizeToken, className } = props

  const { data: lpToken } = useLiquidationPairTokenOutPrice(chainId, lpAddress)

  const uniqueTxHashes = new Set(liquidations.map((liq) => liq.transactionHash))
  const { data: liquidationTxReceipts } = useTxReceipts(chainId, [...uniqueTxHashes])

  const { data: nativeTokenPrices } = useTokenPrices(chainId, [NULL_ADDRESS])
  const nativeTokenPrice = nativeTokenPrices?.[NULL_ADDRESS]

  const efficiency = useMemo(() => {
    if (!!prizeToken?.price && !!lpToken?.price && !!liquidationTxReceipts && !!nativeTokenPrice) {
      const totalAmountIn = liquidations.reduce((a, b) => a + b.args.amountIn, 0n)
      const totalAmountOut = liquidations.reduce((a, b) => a + b.args.amountOut, 0n)

      const totalValueIn =
        parseFloat(formatUnits(totalAmountIn, prizeToken.decimals)) * prizeToken.price
      const totalValueOut =
        parseFloat(formatUnits(totalAmountOut, lpToken.decimals)) * lpToken.price

      const totalGasSpent = liquidationTxReceipts.reduce((a, b) => {
        // TODO: improve typing for rollups
        if (!!(b as any).l1GasUsed && !!(b as any).l1GasPrice && !!(b as any).l1FeeScalar) {
          const l2TxReceipt = b as TransactionReceipt & {
            l1GasUsed: `0x${string}`
            l1GasPrice: `0x${string}`
            l1FeeScalar: string
          }
          const l1Gas = calculatePercentageOfBigInt(
            hexToBigInt(l2TxReceipt.l1GasUsed) * hexToBigInt(l2TxReceipt.l1GasPrice),
            parseFloat(l2TxReceipt.l1FeeScalar)
          )
          const l2Gas = l2TxReceipt.gasUsed * l2TxReceipt.effectiveGasPrice
          const gas = l1Gas + l2Gas
          return a + gas
        } else {
          const gas = b.gasUsed * b.effectiveGasPrice
          return a + gas
        }
      }, 0n)

      const totalGasValueSpent = parseFloat(formatEther(totalGasSpent)) * nativeTokenPrice

      const prizes = (totalValueIn / totalValueOut) * 100
      const gas = (totalGasValueSpent / totalValueOut) * 100
      const bots = 100 - prizes - gas

      return { prizes, gas, bots }
    }
  }, [liquidations, prizeToken, lpToken, liquidationTxReceipts, nativeTokenPrice])

  if (!efficiency) {
    return <Spinner className='after:border-y-pt-purple-800' />
  }

  return (
    <div className={classNames('flex flex-col gap-3 text-sm', className)}>
      <span className='text-pt-purple-500 md:hidden'>{liquidationHeaders.efficiency}</span>
      <div className='flex flex-col gap-1'>
        <AvgEfficiencyBar
          items={[
            { id: 'prizes', value: efficiency.prizes, color: 'green' },
            { id: 'bots', value: efficiency.bots, color: 'yellow' },
            { id: 'gas', value: efficiency.gas, color: 'red' }
          ]}
        />
        <AvgEfficiencyItem efficiency={efficiency.prizes} label='prizes' color='green' />
        <AvgEfficiencyItem efficiency={efficiency.bots} label='bots' color='yellow' />
        <AvgEfficiencyItem efficiency={efficiency.gas} label='gas' color='red' />
      </div>
    </div>
  )
}

type AvgEfficiencyColor = 'green' | 'yellow' | 'red'

interface AvgEfficiencyBarProps {
  items: { id: string; value: number; color: AvgEfficiencyColor }[]
  className?: string
}

const AvgEfficiencyBar = (props: AvgEfficiencyBarProps) => {
  const { items, className } = props

  const totalValue = items.reduce((a, b) => a + b.value, 0)

  return (
    <div className={classNames('w-full h-6 flex rounded overflow-hidden', className)}>
      {items.map((item) => (
        <span
          key={`avgEfficiencyBar-${item.id}`}
          className={classNames({
            'bg-green-600': item.color === 'green',
            'bg-yellow-200': item.color === 'yellow',
            'bg-red-600': item.color === 'red'
          })}
          style={{ width: `${(item.value / totalValue) * 100}%` }}
        />
      ))}
    </div>
  )
}

interface AvgEfficiencyItemProps {
  efficiency: number
  label: ReactNode
  color: AvgEfficiencyColor
  className?: string
}

const AvgEfficiencyItem = (props: AvgEfficiencyItemProps) => {
  const { efficiency, label, color, className } = props

  return (
    <div className={classNames('w-full flex gap-1 items-center whitespace-nowrap', className)}>
      <div
        className={classNames('w-3 h-3 rounded mr-1', {
          'bg-green-600': color === 'green',
          'bg-yellow-200': color === 'yellow',
          'bg-red-600': color === 'red'
        })}
      />
      <span>{formatNumberForDisplay(efficiency, { hideZeroes: true })}%</span>
      <ArrowRightIcon className='w-auto h-3' />
      <span>{label}</span>
    </div>
  )
}
