import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { Token, TokenWithPrice } from '@shared/types'
import { ExternalLink, Spinner } from '@shared/ui'
import { formatBigIntForDisplay, getBlockExplorerUrl } from '@shared/utilities'
import classNames from 'classnames'
import { Address } from 'viem'
import { useLiquidationEvents } from '@hooks/useLiquidationEvents'
import { useLiquidationPairTokenPrice } from '@hooks/useLiquidationPairTokenOutPrice'

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
      <AvgLiquidationPrice />
      <CurrentAvailableYield />
      <AvgEfficiency />
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

  const { data: lpToken } = useLiquidationPairTokenPrice(chainId, lpAddress)

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

  const { data: lpToken } = useLiquidationPairTokenPrice(chainId, lpAddress)

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
