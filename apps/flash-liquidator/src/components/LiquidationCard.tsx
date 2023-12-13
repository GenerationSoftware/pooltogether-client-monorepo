import { useToken, useTokenPrices } from '@generationsoftware/hyperstructure-react-hooks'
import { CurrencyValue, TokenValueAndAmount } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import {
  formatBigIntForDisplay,
  formatNumberForDisplay,
  getBlockExplorerUrl
} from '@shared/utilities'
import classNames from 'classnames'
import Link from 'next/link'
import { ReactNode } from 'react'
import { LiquidationPair } from 'src/types'
import { Address, formatUnits } from 'viem'
import { useBestLiquidation } from '@hooks/useBestLiquidation'
import { useBestLiquidationGasEstimate } from '@hooks/useBestLiquidationGasEstimate'
import { useLpTokenPrice } from '@hooks/useLpTokenPrice'
import { LiquidateButton } from './LiquidateButton'
import { LpBadge } from './LpBadge'

interface LiquidationCardProps {
  liquidationPair: LiquidationPair
  className?: string
}

export const LiquidationCard = (props: LiquidationCardProps) => {
  const { liquidationPair, className } = props

  return (
    <div
      className={classNames(
        'w-full max-w-sm flex flex-col gap-4 px-6 py-4 bg-pt-transparent/20 rounded-3xl',
        className
      )}
    >
      <LpBadgeItem liquidationPair={liquidationPair} />
      <LiquidationCardRow
        name='Liquidation Amount'
        data={<LpTokenOutItem liquidationPair={liquidationPair} />}
      />
      <LiquidationCardRow
        name='Contribution Amount'
        data={<LpTokenInItem liquidationPair={liquidationPair} />}
      />
      <LiquidationCardRow
        name='POOL Received'
        data={<LpRevenueItem liquidationPair={liquidationPair} />}
      />
      <LiquidationCardRow
        name='Estimated Gas'
        data={<LpGasItem liquidationPair={liquidationPair} />}
      />
      <LpProfitItem liquidationPair={liquidationPair} />
    </div>
  )
}

interface LiquidationCardRowProps {
  name: ReactNode
  data: ReactNode
  className?: string
}

const LiquidationCardRow = (props: LiquidationCardRowProps) => {
  const { name, data, className } = props

  return (
    <div className={classNames('inline-flex w-full items-center justify-between', className)}>
      <span className='text-pt-purple-300'>{name}</span>
      <span>{data}</span>
    </div>
  )
}

interface ItemProps {
  liquidationPair: LiquidationPair
}

const LpBadgeItem = (props: ItemProps) => {
  const { liquidationPair } = props

  return (
    <Link
      href={getBlockExplorerUrl(liquidationPair.chainId, liquidationPair.address)}
      target='_blank'
    >
      <LpBadge liquidationPair={liquidationPair} onClick={() => {}} />
    </Link>
  )
}

const LpTokenOutItem = (props: ItemProps) => {
  const { liquidationPair } = props

  const { data: liquidation, isFetched: isFetchedLiquidation } = useBestLiquidation(liquidationPair)

  const { data: token, isFetched: isFetchedTokenPrice } = useLpTokenPrice(liquidationPair)

  const outputTokenAddress = liquidationPair.swapPath[
    liquidationPair.swapPath.length - 1
  ] as Address
  const { data: outputToken, isFetched: isFetchedOutputToken } = useToken(
    liquidationPair.chainId,
    outputTokenAddress
  )
  const { data: tokenPrices, isFetched: isFetchedOutPutTokenPrice } = useTokenPrices(
    liquidationPair.chainId,
    [outputTokenAddress]
  )
  const outputTokenPrice = tokenPrices?.[outputTokenAddress.toLowerCase() as Address]

  if (
    !isFetchedLiquidation ||
    !liquidation ||
    !isFetchedTokenPrice ||
    !token ||
    (liquidation.success &&
      (!isFetchedOutputToken ||
        !outputToken ||
        !isFetchedOutPutTokenPrice ||
        outputTokenPrice === undefined))
  ) {
    return <Spinner />
  }

  const calculatedValue =
    liquidation.success && !!outputToken && !!outputTokenPrice
      ? parseFloat(formatUnits(liquidation.amountIn + liquidation.profit, outputToken.decimals)) *
        outputTokenPrice
      : undefined

  const queriedValue = !!token?.price
    ? parseFloat(formatUnits(liquidation.amountOut, token.decimals)) * token.price
    : undefined

  const value = calculatedValue ?? queriedValue

  return (
    <div className='flex gap-1 items-center'>
      <span className={classNames('font-semibold', { 'text-pt-teal-dark': !!value })}>
        {value !== undefined ? <CurrencyValue baseValue={value} fallback={<></>} /> : <>?</>}
      </span>
      <span className='text-sm font-medium text-pt-purple-300 whitespace-nowrap'>
        {formatBigIntForDisplay(liquidation.amountOut, token.decimals)} {token.symbol}
      </span>
    </div>
  )
}

const LpTokenInItem = (props: ItemProps) => {
  const { liquidationPair } = props

  const { data: liquidation, isFetched } = useBestLiquidation(liquidationPair)

  if (!isFetched || !liquidation) {
    return <Spinner />
  }

  const chainId = liquidationPair.chainId
  const address = liquidationPair.swapPath[liquidationPair.swapPath.length - 1] as Address
  const amount = liquidation.amountIn

  return (
    <TokenValueAndAmount
      token={{ chainId, address, amount }}
      className='!flex-row gap-1'
      valueClassName='font-semibold text-pt-warning-light'
      amountClassName='font-sm text-pt-purple-300 whitespace-nowrap'
    />
  )
}

const LpRevenueItem = (props: ItemProps) => {
  const { liquidationPair } = props

  const { data: liquidation, isFetched } = useBestLiquidation(liquidationPair)

  if (!isFetched || !liquidation) {
    return <Spinner />
  }

  const chainId = liquidationPair.chainId
  const address = liquidationPair.swapPath[liquidationPair.swapPath.length - 1] as Address
  const amount = liquidation.profit

  return (
    <TokenValueAndAmount
      token={{ chainId, address, amount }}
      className='!flex-row gap-1'
      valueClassName='font-semibold'
      amountClassName='font-sm text-pt-purple-300 whitespace-nowrap'
    />
  )
}

const LpGasItem = (props: ItemProps) => {
  const { liquidationPair } = props

  const { data: gasEstimate, isFetched } = useBestLiquidationGasEstimate(liquidationPair)

  if (!isFetched || !gasEstimate) {
    return <Spinner />
  }

  // TODO: this assumes the gas token is ETH
  return (
    <div className='flex gap-1 items-center'>
      <span className='font-semibold'>
        <CurrencyValue baseValue={gasEstimate.totalGasEth} fallback={<></>} />
      </span>
      <span className='font-sm text-pt-purple-300 whitespace-nowrap'>
        {formatNumberForDisplay(gasEstimate.totalGasEth)} ETH
      </span>
    </div>
  )
}

const LpProfitItem = (props: ItemProps) => {
  const { liquidationPair } = props

  return <LiquidateButton liquidationPair={liquidationPair} className='w-full' />
}
