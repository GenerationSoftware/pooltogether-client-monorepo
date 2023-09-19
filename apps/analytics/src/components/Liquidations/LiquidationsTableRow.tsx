import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Token, TokenWithPrice } from '@shared/types'
import { ExternalLink, Spinner } from '@shared/ui'
import {
  formatBigIntForDisplay,
  formatNumberForDisplay,
  getBlockExplorerUrl
} from '@shared/utilities'
import classNames from 'classnames'
import { ReactNode, useMemo } from 'react'
import { Address, formatUnits } from 'viem'
import { useLiquidationEvents } from '@hooks/useLiquidationEvents'
import { useLiquidationPairLiquidatableBalance } from '@hooks/useLiquidationPairLiquidatableBalance'
import { useLiquidationPairTokenOutData } from '@hooks/useLiquidationPairTokenOutData'
import { useLiquidationPairTokenOutPrice } from '@hooks/useLiquidationPairTokenOutPrice'

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
    <div className={classNames('py-3 text-sm bg-pt-purple-100/20 rounded-xl', className)}>
      <LiquidationPairLink
        chainId={prizePool.chainId}
        lpAddress={lpAddress}
        prizeToken={prizeToken}
      />
      <YieldAuctioned
        chainId={prizePool.chainId}
        lpAddress={lpAddress}
        liquidations={lpLiquidations}
      />
      <AvgLiquidationPrice
        chainId={prizePool.chainId}
        lpAddress={lpAddress}
        liquidations={lpLiquidations}
        prizeToken={prizeToken}
      />
      <CurrentAvailableYield chainId={prizePool.chainId} lpAddress={lpAddress} />
      <AvgEfficiency
        chainId={prizePool.chainId}
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
    <div className={classNames('text-sm', className)}>
      <span className='text-xl font-semibold'>
        {formatBigIntForDisplay(totalYieldAuctioned, lpToken.decimals, { hideZeroes: true })}
      </span>{' '}
      {lpToken.symbol}
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
    <div className={classNames('text-sm whitespace-nowrap', className)}>
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

  if (!liquidatableBalance || !lpToken) {
    return <Spinner className='after:border-y-pt-purple-800' />
  }

  return (
    <div className={classNames('text-sm', className)}>
      <span className='text-xl font-semibold'>
        {formatBigIntForDisplay(liquidatableBalance, lpToken.decimals, { hideZeroes: true })}
      </span>{' '}
      {lpToken.symbol}
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

  const efficiency = useMemo(() => {
    if (!!prizeToken?.price && !!lpToken?.price) {
      const totalAmountIn = liquidations.reduce((a, b) => a + b.args.amountIn, 0n)
      const totalAmountOut = liquidations.reduce((a, b) => a + b.args.amountOut, 0n)

      const totalValueIn =
        parseFloat(formatUnits(totalAmountIn, prizeToken.decimals)) * prizeToken.price
      const totalValueOut =
        parseFloat(formatUnits(totalAmountOut, lpToken.decimals)) * lpToken.price

      const prizes = (totalValueIn / totalValueOut) * 100
      const gas = 0 // TODO: calculate percentage spent in gas
      const bots = 100 - prizes - gas

      return { prizes, gas, bots }
    }
  }, [liquidations, prizeToken, lpToken])

  if (!efficiency) {
    return <Spinner className='after:border-y-pt-purple-800' />
  }

  return (
    <div className={classNames('flex flex-col gap-1', className)}>
      {/* TODO: bar with percentages */}
      <AvgEfficiencyItem efficiency={efficiency.prizes} label='prizes' color='green' />
      <AvgEfficiencyItem efficiency={efficiency.bots} label='bots (WIP)' color='yellow' />
      <AvgEfficiencyItem efficiency={efficiency.gas} label='gas (WIP)' color='red' />
    </div>
  )
}

interface AvgEfficiencyItemProps {
  efficiency: number
  label: ReactNode
  color: 'green' | 'yellow' | 'red'
  className?: string
}

const AvgEfficiencyItem = (props: AvgEfficiencyItemProps) => {
  const { efficiency, label, color, className } = props

  return (
    <div
      className={classNames('w-full flex gap-1 items-center text-sm whitespace-nowrap', className)}
    >
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
