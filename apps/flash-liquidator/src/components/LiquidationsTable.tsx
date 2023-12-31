import { useToken, useTokenPrices } from '@generationsoftware/hyperstructure-react-hooks'
import { useScreenSize } from '@shared/generic-react-hooks'
import { CurrencyValue, TokenValueAndAmount } from '@shared/react-components'
import { Spinner, Table, TableData } from '@shared/ui'
import {
  formatBigIntForDisplay,
  formatNumberForDisplay,
  getBlockExplorerUrl
} from '@shared/utilities'
import classNames from 'classnames'
import Link from 'next/link'
import { LiquidationPair } from 'src/types'
import { Address, formatUnits } from 'viem'
import { LIQUIDATION_PAIRS } from '@constants/config'
import { useBestLiquidation } from '@hooks/useBestLiquidation'
import { useBestLiquidationGasEstimate } from '@hooks/useBestLiquidationGasEstimate'
import { useLpTokenPrice } from '@hooks/useLpTokenPrice'
import { LiquidateButton } from './LiquidateButton'
import { LiquidationCard } from './LiquidationCard'
import { LpBadge } from './LpBadge'

interface LiquidationsTableProps {
  className?: string
}

export const LiquidationsTable = (props: LiquidationsTableProps) => {
  const { className } = props

  const { isMobile } = useScreenSize()

  const tableData: TableData = {
    headers: {
      lp: { content: 'Liquidation Pair', className: 'pl-11' },
      tokenOut: { content: 'Liquidation Amount', position: 'center' },
      tokenIn: { content: 'Contribution Amount', position: 'center' },
      revenue: { content: 'POOL Received', position: 'center' },
      gas: { content: 'Estimated Gas', position: 'center' },
      profit: { content: 'Estimated Profit', position: 'center' }
    },
    rows: LIQUIDATION_PAIRS.map((lp) => ({
      id: `lp-${lp.address}-${lp.chainId}`,
      cells: {
        lp: {
          content: <LpBadgeItem liquidationPair={lp} />
        },
        tokenOut: { content: <LpTokenOutItem liquidationPair={lp} />, position: 'center' },
        tokenIn: { content: <LpTokenInItem liquidationPair={lp} />, position: 'center' },
        revenue: { content: <LpRevenueItem liquidationPair={lp} />, position: 'center' },
        gas: { content: <LpGasItem liquidationPair={lp} />, position: 'center' },
        profit: { content: <LpProfitItem liquidationPair={lp} />, position: 'center' }
      }
    }))
  }

  if (isMobile) {
    return (
      <div className='w-full flex flex-col gap-4 items-center'>
        {LIQUIDATION_PAIRS.map((lp) => (
          <LiquidationCard key={`lp-${lp.address}-${lp.chainId}`} liquidationPair={lp} />
        ))}
      </div>
    )
  }

  return (
    <Table
      keyPrefix='liquidationPairsTable'
      data={tableData}
      className={classNames('px-6 pb-6 bg-pt-bg-purple rounded-lg', className)}
      headerClassName='text-center font-medium text-pt-purple-200 whitespace-nowrap'
      rowClassName='py-6 text-sm font-medium rounded-lg overflow-hidden'
    />
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
    <div className='flex flex-col gap-1 items-center'>
      <span className={classNames('text-2xl font-semibold', { 'text-pt-teal-dark': !!value })}>
        {value !== undefined ? <CurrencyValue baseValue={value} fallback={<></>} /> : <>?</>}
      </span>
      <span className='font-medium text-pt-purple-300'>
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
      className='gap-1'
      valueClassName='text-2xl font-semibold text-pt-warning-light'
      amountClassName='font-medium text-pt-purple-300'
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
      className='gap-1'
      valueClassName='text-2xl font-semibold'
      amountClassName='font-medium text-pt-purple-300'
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
    <div className='flex flex-col gap-1 items-center'>
      <span className='text-2xl font-semibold'>
        <CurrencyValue baseValue={gasEstimate.totalGasEth} fallback={<></>} />
      </span>
      <span className='font-medium text-pt-purple-300'>
        {formatNumberForDisplay(gasEstimate.totalGasEth)} ETH
      </span>
    </div>
  )
}

const LpProfitItem = (props: ItemProps) => {
  const { liquidationPair } = props

  return <LiquidateButton liquidationPair={liquidationPair} className='w-full' />
}
