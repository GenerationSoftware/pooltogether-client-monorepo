import { useScreenSize } from '@shared/generic-react-hooks'
import { CurrencyValue, TokenValueAndAmount } from '@shared/react-components'
import { Spinner, Table, TableData } from '@shared/ui'
import { formatNumberForDisplay, getBlockExplorerUrl } from '@shared/utilities'
import classNames from 'classnames'
import Link from 'next/link'
import { LiquidationPair } from 'src/types'
import { Address } from 'viem'
import { LIQUIDATION_PAIRS } from '@constants/config'
import { useBestLiquidation } from '@hooks/useBestLiquidation'
import { useBestLiquidationGasEstimate } from '@hooks/useBestLiquidationGasEstimate'
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
      className={classNames('px-6 pb-6 bg-pt-transparent/20 rounded-3xl', className)}
      headerClassName='text-center font-medium text-pt-purple-300 whitespace-nowrap'
      rowClassName='text-sm font-medium rounded-lg overflow-hidden'
      gridColsClassName={`grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.5fr)]`}
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

  const { data: liquidation, isFetched } = useBestLiquidation(liquidationPair)

  if (!isFetched || !liquidation) {
    return <Spinner />
  }

  const chainId = liquidationPair.chainId
  const address = liquidationPair.swapPath[0]
  const amount = liquidation.amountOut

  // TODO: need to handle prices for prize tokens (don't actually query it, just calculate off of other `bestLiquidation` values)
  return <TokenValueAndAmount token={{ chainId, address, amount }} />
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

  return <TokenValueAndAmount token={{ chainId, address, amount }} />
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

  return <TokenValueAndAmount token={{ chainId, address, amount }} />
}

const LpGasItem = (props: ItemProps) => {
  const { liquidationPair } = props

  const { data: gasEstimate, isFetched } = useBestLiquidationGasEstimate(liquidationPair)

  if (!isFetched || !gasEstimate) {
    return <Spinner />
  }

  // TODO: this assumes the gas token is ETH
  return (
    <div className='flex flex-col items-center'>
      <CurrencyValue baseValue={gasEstimate.totalGasEth} />
      <span className='text-pt-purple-200'>
        {formatNumberForDisplay(gasEstimate.totalGasEth)} ETH
      </span>
    </div>
  )
}

const LpProfitItem = (props: ItemProps) => {
  const { liquidationPair } = props

  return <LiquidateButton liquidationPair={liquidationPair} />
}
