import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { Token } from '@shared/types'
import { ExternalLink } from '@shared/ui'
import { formatBigIntForDisplay, getBlockExplorerUrl, shorten } from '@shared/utilities'
import classNames from 'classnames'
import { Address } from 'viem'
import { useLiquidationEvents } from '@hooks/useLiquidationEvents'

interface LiquidationsTableRowProps {
  prizePool: PrizePool
  lpAddress: Address
  liquidations: NonNullable<ReturnType<typeof useLiquidationEvents>['data']>
  prizeToken: Token
  className?: string
}

export const LiquidationsTableRow = (props: LiquidationsTableRowProps) => {
  const { prizePool, lpAddress, liquidations, className } = props

  // TODO: get token out info

  const lpLiquidations = liquidations.filter(
    (liq) => liq.args.liquidationPair.toLowerCase() === lpAddress.toLowerCase()
  )

  return (
    <div className={classNames('py-3 text-sm bg-pt-purple-100/20 rounded-xl', className)}>
      <LiquidationPairLink chainId={prizePool.chainId} lpAddress={lpAddress} />
      {/* <YieldAuctioned liquidations={lpLiquidations} token={tokenOut} /> */}
      <AvgLiquidationPrice />
      <CurrentAvailableYield />
      <AvgEfficiency />
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

  // TODO: display ptUSDC/POOL (for example), not the lp address
  return (
    <ExternalLink
      href={getBlockExplorerUrl(chainId, lpAddress)}
      className={classNames('text-xl font-semibold', className)}
      iconClassName='text-pt-purple-400'
    >
      {shorten(lpAddress)}
    </ExternalLink>
  )
}

interface YieldAuctionedProps {
  liquidations: LiquidationsTableRowProps['liquidations']
  token: Token
  className?: string
}

const YieldAuctioned = (props: YieldAuctionedProps) => {
  const { liquidations, token, className } = props

  const totalYieldAuctioned = liquidations.reduce((a, b) => a + b.args.amountOut, 0n)

  return (
    <div className={classNames('text-sm', className)}>
      <span className='text-xl font-semibold'>
        {formatBigIntForDisplay(totalYieldAuctioned, token.decimals, { hideZeroes: true })}
      </span>{' '}
      {token.symbol}
    </div>
  )
}

interface AvgLiquidationPriceProps {
  className?: string
}

const AvgLiquidationPrice = (props: AvgLiquidationPriceProps) => {
  const { className } = props

  return <span>-</span>
}

interface CurrentAvailableYieldProps {
  className?: string
}

const CurrentAvailableYield = (props: CurrentAvailableYieldProps) => {
  const { className } = props

  return <span>-</span>
}

interface AvgEfficiencyProps {
  className?: string
}

const AvgEfficiency = (props: AvgEfficiencyProps) => {
  const { className } = props

  return <span>-</span>
}
