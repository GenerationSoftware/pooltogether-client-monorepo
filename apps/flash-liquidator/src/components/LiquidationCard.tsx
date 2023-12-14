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
        'w-full max-w-sm flex flex-col gap-4 items-center p-6 bg-pt-bg-purple rounded-lg',
        className
      )}
    >
      <LpBadgeItem liquidationPair={liquidationPair} />
      <div className='w-full flex items-center justify-between'>
        <LpTokenOutItem liquidationPair={liquidationPair} />
        <LpTokenInItem liquidationPair={liquidationPair} />
      </div>
      <div className='w-full flex items-center justify-between'>
        <LpRevenueItem liquidationPair={liquidationPair} />
        <LpGasItem liquidationPair={liquidationPair} />
      </div>
      <LpProfitItem liquidationPair={liquidationPair} />
    </div>
  )
}

interface BasicItemProps {
  title: string
  content: ReactNode
}

const BasicItem = (props: BasicItemProps) => {
  const { title, content } = props

  return (
    <div className='w-full flex flex-col gap-1 items-center text-center'>
      <span className='text-sm text-pt-purple-200'>{title}</span>
      {content}
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
    return <BasicItem title='Liquidation Amount' content={<Spinner />} />
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
    <BasicItem
      title='Liquidation Amount'
      content={
        <div className='flex flex-col items-center'>
          <span className={classNames('text-2xl font-semibold', { 'text-pt-teal-dark': !!value })}>
            {value !== undefined ? <CurrencyValue baseValue={value} fallback={<></>} /> : <>?</>}
          </span>
          <span className='text-xs text-pt-purple-300'>
            {formatBigIntForDisplay(liquidation.amountOut, token.decimals)} {token.symbol}
          </span>
        </div>
      }
    />
  )
}

const LpTokenInItem = (props: ItemProps) => {
  const { liquidationPair } = props

  const { data: liquidation, isFetched } = useBestLiquidation(liquidationPair)

  if (!isFetched || !liquidation) {
    return <BasicItem title='Contribution Amount' content={<Spinner />} />
  }

  const chainId = liquidationPair.chainId
  const address = liquidationPair.swapPath[liquidationPair.swapPath.length - 1] as Address
  const amount = liquidation.amountIn

  return (
    <BasicItem
      title='Contribution Amount'
      content={
        <TokenValueAndAmount
          token={{ chainId, address, amount }}
          valueClassName='text-2xl font-semibold text-pt-warning-light'
          amountClassName='text-xs text-pt-purple-300'
        />
      }
    />
  )
}

const LpRevenueItem = (props: ItemProps) => {
  const { liquidationPair } = props

  const { data: liquidation, isFetched } = useBestLiquidation(liquidationPair)

  if (!isFetched || !liquidation) {
    return <BasicItem title='POOL Received' content={<Spinner />} />
  }

  const chainId = liquidationPair.chainId
  const address = liquidationPair.swapPath[liquidationPair.swapPath.length - 1] as Address
  const amount = liquidation.profit

  return (
    <BasicItem
      title='POOL Received'
      content={
        <TokenValueAndAmount
          token={{ chainId, address, amount }}
          valueClassName='text-2xl font-semibold'
          amountClassName='text-xs text-pt-purple-300'
        />
      }
    />
  )
}

const LpGasItem = (props: ItemProps) => {
  const { liquidationPair } = props

  const { data: gasEstimate, isFetched } = useBestLiquidationGasEstimate(liquidationPair)

  if (!isFetched || !gasEstimate) {
    return <BasicItem title='Estimated Gas' content={<Spinner />} />
  }
  // TODO: this assumes the gas token is ETH
  return (
    <BasicItem
      title='Estimated Gas'
      content={
        <div className='flex flex-col items-center'>
          <span className='text-2xl font-semibold'>
            <CurrencyValue baseValue={gasEstimate.totalGasEth} fallback={<></>} />
          </span>
          <span className='text-xs text-pt-purple-300'>
            {formatNumberForDisplay(gasEstimate.totalGasEth)} ETH
          </span>
        </div>
      }
    />
  )
}

const LpProfitItem = (props: ItemProps) => {
  const { liquidationPair } = props

  return <LiquidateButton liquidationPair={liquidationPair} className='w-full max-w-[70%]' />
}
