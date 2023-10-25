import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useLiquidationEvents,
  useTokenPrices,
  useTxReceipts
} from '@generationsoftware/hyperstructure-react-hooks'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Token, TokenWithPrice } from '@shared/types'
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
import { useLiquidationPairTokenOutData } from '@hooks/useLiquidationPairTokenOutData'
import { useLiquidationPairTokenOutPrice } from '@hooks/useLiquidationPairTokenOutPrice'
import { liquidationHeaders } from './LiquidationsTable'
import { LiquidationTxsDropdown } from './LiquidationTxsDropdown'

interface LiquidationsTableRowProps {
  prizePool: PrizePool
  lpAddress: Address
  liquidations: NonNullable<ReturnType<typeof useLiquidationEvents>['data']>
  prizeToken: TokenWithPrice
  className?: string
  gridClassName?: string
}

export const LiquidationsTableRow = (props: LiquidationsTableRowProps) => {
  const { prizePool, lpAddress, liquidations, prizeToken, className, gridClassName } = props

  const lpLiquidations = liquidations.filter(
    (liq) => liq.args.liquidationPair.toLowerCase() === lpAddress.toLowerCase()
  )

  return (
    <div
      className={classNames(
        'w-full flex flex-col gap-4 text-sm bg-pt-purple-100/50 rounded-xl',
        className
      )}
    >
      <div className={gridClassName}>
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
      <LiquidationTxsDropdown
        prizePool={prizePool}
        lpAddress={lpAddress}
        liquidations={lpLiquidations}
        prizeToken={prizeToken}
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
      className={classNames('h-min text-xl font-semibold', className)}
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

  const { data: nativeTokenPrices } = useTokenPrices(chainId, [DOLPHIN_ADDRESS])
  const nativeTokenPrice = nativeTokenPrices?.[DOLPHIN_ADDRESS]

  const efficiency = useMemo(() => {
    if (!!prizeToken?.price && !!lpToken?.price && !!liquidationTxReceipts && !!nativeTokenPrice) {
      const totalAmountIn = liquidations.reduce((a, b) => a + b.args.amountIn, 0n)
      const totalAmountOut = liquidations.reduce((a, b) => a + b.args.amountOut, 0n)

      const totalValueIn =
        parseFloat(formatUnits(totalAmountIn, prizeToken.decimals)) * prizeToken.price
      const totalValueOut =
        parseFloat(formatUnits(totalAmountOut, lpToken.decimals)) * lpToken.price

      const totalGasSpent = liquidationTxReceipts.reduce((a, b) => a + getTxGasSpent(b), 0n)
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
      <span>
        {formatNumberForDisplay(efficiency, { hideZeroes: true, maximumFractionDigits: 1 })}%
      </span>
      <ArrowRightIcon className='w-auto h-3' />
      <span>{label}</span>
    </div>
  )
}
