import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useLiquidationEvents,
  useTokenPrices,
  useTxReceipts
} from '@generationsoftware/hyperstructure-react-hooks'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { ExternalLink, Spinner } from '@shared/ui'
import {
  DOLPHIN_ADDRESS,
  formatBigIntForDisplay,
  formatNumberForDisplay,
  getBlockExplorerUrl
} from '@shared/utilities'
import classNames from 'classnames'
import { ReactNode, useMemo } from 'react'
import { getTxGasSpent } from 'src/utils'
import { Address, formatEther, formatUnits } from 'viem'
import { useLiquidationPairLiquidatableBalance } from '@hooks/useLiquidationPairLiquidatableBalance'
import { useLiquidationPairTokenInData } from '@hooks/useLiquidationPairTokenInData'
import { useLiquidationPairTokenInPrice } from '@hooks/useLiquidationPairTokenInPrice'
import { useLiquidationPairTokenOutData } from '@hooks/useLiquidationPairTokenOutData'
import { useLiquidationPairTokenOutPrice } from '@hooks/useLiquidationPairTokenOutPrice'
import { liquidationHeaders } from './LiquidationsTable'
import { LiquidationTxsDropdown } from './LiquidationTxsDropdown'

interface LiquidationsTableRowProps {
  prizePool: PrizePool
  lpAddress: Address
  liquidations: NonNullable<ReturnType<typeof useLiquidationEvents>['data']>
  className?: string
  gridClassName?: string
}

export const LiquidationsTableRow = (props: LiquidationsTableRowProps) => {
  const { prizePool, lpAddress, liquidations, className, gridClassName } = props

  const lpLiquidations = liquidations.filter(
    (liq) => liq.args.liquidationPair.toLowerCase() === lpAddress.toLowerCase()
  )

  return (
    <div
      className={classNames(
        'w-full flex flex-col gap-4 text-sm bg-pt-transparent rounded-xl',
        className
      )}
    >
      <div className={gridClassName}>
        <LiquidationPairLink
          chainId={prizePool.chainId}
          lpAddress={lpAddress}
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
          className='w-1/2 md:w-auto'
        />
      </div>
      <LiquidationTxsDropdown
        prizePool={prizePool}
        lpAddress={lpAddress}
        liquidations={lpLiquidations}
      />
    </div>
  )
}

interface LiquidationPairLinkProps {
  chainId: number
  lpAddress: Address
  className?: string
}

const LiquidationPairLink = (props: LiquidationPairLinkProps) => {
  const { chainId, lpAddress, className } = props

  const { data: tokenIn } = useLiquidationPairTokenInData(chainId, lpAddress)
  const { data: tokenOut } = useLiquidationPairTokenOutData(chainId, lpAddress)

  if (!tokenIn || !tokenOut) {
    return <Spinner className='after:border-y-pt-purple-300' />
  }

  return (
    <ExternalLink
      href={getBlockExplorerUrl(chainId, lpAddress)}
      className={classNames('text-pt-purple-200 h-min text-xl font-semibold', className)}
      iconClassName='text-blue-300 hover:text-blue-200 transition'
    >
      {tokenOut.symbol ?? '?'}/{tokenIn.symbol}
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

  const { data: tokenOut } = useLiquidationPairTokenOutData(chainId, lpAddress)

  if (!tokenOut) {
    return <Spinner className='after:border-y-pt-purple-300' />
  }

  const totalYieldAuctioned = liquidations.reduce((a, b) => a + b.args.amountOut, 0n)

  return (
    <div className={classNames('flex flex-col gap-3 text-sm', className)}>
      <span className='text-pt-purple-500 md:hidden'>{liquidationHeaders.auctioned}</span>
      <span className='text-pt-purple-200'>
        <span className='text-xl font-semibold'>
          {formatBigIntForDisplay(totalYieldAuctioned, tokenOut.decimals, { hideZeroes: true })}
        </span>{' '}
        {tokenOut.symbol}
      </span>
    </div>
  )
}

interface AvgLiquidationPriceProps {
  chainId: number
  lpAddress: Address
  liquidations: LiquidationsTableRowProps['liquidations']
  className?: string
}

const AvgLiquidationPrice = (props: AvgLiquidationPriceProps) => {
  const { chainId, lpAddress, liquidations, className } = props

  const { data: tokenIn } = useLiquidationPairTokenInData(chainId, lpAddress)
  const { data: tokenOut } = useLiquidationPairTokenOutData(chainId, lpAddress)

  const avgPrice = useMemo(() => {
    if (!!tokenIn && !!tokenOut) {
      if (!liquidations.length) return 0
      const avgAmountIn =
        parseFloat(
          formatUnits(
            liquidations.reduce((a, b) => a + b.args.amountIn, 0n),
            tokenIn.decimals
          )
        ) / liquidations.length
      const avgAmountOut =
        parseFloat(
          formatUnits(
            liquidations.reduce((a, b) => a + b.args.amountOut, 0n),
            tokenOut.decimals
          )
        ) / liquidations.length
      return avgAmountIn / avgAmountOut
    }
  }, [liquidations, tokenIn, tokenOut])

  return (
    <div className={classNames('flex flex-col gap-3 text-sm', className)}>
      <span className='text-pt-purple-500 md:hidden'>{liquidationHeaders.price}</span>
      <span className='whitespace-nowrap text-pt-purple-200'>
        {!!tokenIn && !!tokenOut && !!avgPrice ? (
          <>
            <span className='text-xl font-semibold'>1</span> {tokenOut.symbol} ={' '}
            <span className='text-xl font-semibold'>
              {formatNumberForDisplay(
                avgPrice,
                avgPrice > 100 ? { hideZeroes: true } : { maximumFractionDigits: 2 }
              )}
            </span>{' '}
            {tokenIn.symbol}
          </>
        ) : (
          <Spinner className='after:border-y-pt-purple-200' />
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

  const { data: tokenOut } = useLiquidationPairTokenOutData(chainId, lpAddress)

  if (liquidatableBalance === undefined || !tokenOut) {
    return <Spinner className='after:border-y-pt-purple-200' />
  }

  return (
    <div className={classNames('flex flex-col gap-3 text-sm', className)}>
      <span className='text-pt-purple-500 md:hidden'>{liquidationHeaders.available}</span>
      <span className='text-pt-purple-200'>
        <span className='text-xl font-semibold'>
          {formatBigIntForDisplay(liquidatableBalance, tokenOut.decimals, { hideZeroes: true })}
        </span>{' '}
        {tokenOut.symbol}
      </span>
    </div>
  )
}

enum EfficiencyColor {
  green = 'bg-green-200',
  yellow = 'bg-yellow-300',
  red = 'bg-red-500'
}

interface AvgEfficiencyProps {
  chainId: number
  lpAddress: Address
  liquidations: LiquidationsTableRowProps['liquidations']
  className?: string
}

const AvgEfficiency = (props: AvgEfficiencyProps) => {
  const { chainId, lpAddress, liquidations, className } = props

  const { data: tokenIn } = useLiquidationPairTokenInPrice(chainId, lpAddress)
  const { data: tokenOut } = useLiquidationPairTokenOutPrice(chainId, lpAddress)

  const uniqueTxHashes = new Set(liquidations.map((liq) => liq.transactionHash))
  const { data: liquidationTxReceipts } = useTxReceipts(chainId, [...uniqueTxHashes])

  const { data: nativeTokenPrices } = useTokenPrices(chainId, [DOLPHIN_ADDRESS])
  const nativeTokenPrice = nativeTokenPrices?.[DOLPHIN_ADDRESS]

  const efficiency = useMemo(() => {
    if (!!tokenIn?.price && !!tokenOut?.price && !!liquidationTxReceipts && !!nativeTokenPrice) {
      const totalAmountIn = liquidations.reduce((a, b) => a + b.args.amountIn, 0n)
      const totalAmountOut = liquidations.reduce((a, b) => a + b.args.amountOut, 0n)

      const totalValueIn = parseFloat(formatUnits(totalAmountIn, tokenIn.decimals)) * tokenIn.price
      const totalValueOut =
        parseFloat(formatUnits(totalAmountOut, tokenOut.decimals)) * tokenOut.price

      const totalGasSpent = liquidationTxReceipts.reduce((a, b) => a + getTxGasSpent(b), 0n)
      const totalGasValueSpent = parseFloat(formatEther(totalGasSpent)) * nativeTokenPrice

      const prizes = (totalValueIn / totalValueOut) * 100
      const gas = (totalGasValueSpent / totalValueOut) * 100
      const bots = 100 - prizes - gas

      return { prizes, gas, bots }
    }
  }, [liquidations, tokenIn, tokenOut, liquidationTxReceipts, nativeTokenPrice])

  if (!efficiency) {
    return <Spinner className='after:border-y-pt-purple-300' />
  }

  return (
    <div className={classNames('flex flex-col gap-3 text-sm', className)}>
      <span className='text-pt-purple-500 md:hidden'>{liquidationHeaders.efficiency}</span>
      <div className='flex flex-col gap-1'>
        <AvgEfficiencyBar
          items={[
            { id: 'prizes', value: efficiency.prizes, color: EfficiencyColor.green },
            { id: 'bots', value: efficiency.bots, color: EfficiencyColor.yellow },
            { id: 'gas', value: efficiency.gas, color: EfficiencyColor.red }
          ]}
        />
        <AvgEfficiencyItem
          efficiency={efficiency.prizes}
          label='prizes'
          color={EfficiencyColor.green}
        />
        <AvgEfficiencyItem
          efficiency={efficiency.bots}
          label='bots'
          color={EfficiencyColor.yellow}
        />
        <AvgEfficiencyItem efficiency={efficiency.gas} label='gas' color={EfficiencyColor.red} />
      </div>
    </div>
  )
}

interface AvgEfficiencyBarProps {
  items: { id: string; value: number; color: EfficiencyColor }[]
  className?: string
}

const AvgEfficiencyBar = (props: AvgEfficiencyBarProps) => {
  const { items, className } = props

  return (
    <div className={classNames('w-full h-6 flex rounded overflow-hidden', className)}>
      {items.map((item) => (
        <span
          key={`avgEfficiencyBar-${item.id}`}
          className={classNames('shrink-0', item.color)}
          style={{ width: `${item.value}%` }}
        />
      ))}
    </div>
  )
}

interface AvgEfficiencyItemProps {
  efficiency: number
  label: ReactNode
  color: EfficiencyColor
  className?: string
}

const AvgEfficiencyItem = (props: AvgEfficiencyItemProps) => {
  const { efficiency, label, color, className } = props

  return (
    <div
      className={classNames(
        'w-full flex gap-1 items-center whitespace-nowrap text-pt-purple-200',
        className
      )}
    >
      <div className={classNames('w-3 h-3 rounded mr-1', color)} />
      <span>
        {formatNumberForDisplay(efficiency, { hideZeroes: true, maximumFractionDigits: 1 })}%
      </span>
      <ArrowRightIcon className='w-auto h-3' />
      <span>{label}</span>
    </div>
  )
}
