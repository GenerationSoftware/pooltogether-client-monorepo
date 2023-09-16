import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { usePrizeTokenData } from '@generationsoftware/hyperstructure-react-hooks'
import { Token } from '@shared/types'
import { Spinner } from '@shared/ui'
import { formatBigIntForDisplay, MAX_UINT_256, SECONDS_PER_HOUR } from '@shared/utilities'
import classNames from 'classnames'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { currentTimestampAtom } from 'src/atoms'
import { Block, parseUnits } from 'viem'
import { useManualContributionEvents } from '@hooks/useManualContributionEvents'
import { usePrizeBackstopEvents } from '@hooks/usePrizeBackstopEvents'
import { useRngTxs } from '@hooks/useRngTxs'

interface ReserveCardProps {
  prizePool: PrizePool
  minBlock?: Block
  maxBlock?: Block
  className?: string
}

export const ReserveCard = (props: ReserveCardProps) => {
  const { prizePool, minBlock, maxBlock, className } = props

  const currentTimestamp = useAtomValue(currentTimestampAtom)

  // TODO: get POOL amount in liquidations in the last 24hrs
  const isFetchedLiquidations = true
  const validLiquidations = parseUnits('0', 18)

  const { data: manualContributionEvents, isFetched: isFetchedManualContributionEvents } =
    useManualContributionEvents(prizePool)
  const validManualContributions = useMemo(() => {
    if (!!manualContributionEvents) {
      return manualContributionEvents.reduce(
        (a, b) =>
          a +
          (b.blockNumber >= (minBlock?.number ?? 0n) &&
          b.blockNumber <= (maxBlock?.number ?? MAX_UINT_256)
            ? b.args.amount
            : 0n),
        0n
      )
    }
    return 0n
  }, [manualContributionEvents, minBlock, maxBlock])

  const { data: rngTxs, isFetched: isFetchedRngTxs } = useRngTxs(prizePool)
  const validRngFees = useMemo(() => {
    if (!!rngTxs) {
      return rngTxs.reduce(
        (a, b) =>
          a +
          (!!b.relay &&
          b.relay.block >= (minBlock?.number ?? 0n) &&
          b.relay.block <= (maxBlock?.number ?? MAX_UINT_256)
            ? (b.rng.fee ?? 0n) + b.relay.fee
            : 0n),
        0n
      )
    }
    return 0n
  }, [rngTxs, minBlock, maxBlock])

  const { data: prizeBackstopEvents, isFetched: isFetchedPrizeBackstopEvents } =
    usePrizeBackstopEvents(prizePool)
  const validPrizeBackstops = useMemo(() => {
    if (!!prizeBackstopEvents) {
      return prizeBackstopEvents.reduce(
        (a, b) =>
          a +
          (b.blockNumber >= (minBlock?.number ?? 0n) &&
          b.blockNumber <= (maxBlock?.number ?? MAX_UINT_256)
            ? b.args.amount
            : 0n),
        0n
      )
    }
    return 0n
  }, [prizeBackstopEvents, minBlock, maxBlock])

  const { data: prizeToken } = usePrizeTokenData(prizePool)

  if (
    !prizeToken ||
    !isFetchedLiquidations ||
    !isFetchedManualContributionEvents ||
    !isFetchedRngTxs ||
    !isFetchedPrizeBackstopEvents
  ) {
    return <Spinner className='after:border-y-pt-purple-800' />
  }

  const minTimestamp = Number(minBlock?.timestamp ?? 0)
  const maxTimestamp = Number(maxBlock?.timestamp ?? currentTimestamp)
  const hours = Math.round((maxTimestamp - minTimestamp) / SECONDS_PER_HOUR)
  const timeText = minTimestamp === 0 ? `All time` : `${hours}hr`

  return (
    <div
      className={classNames(
        'w-full max-w-md flex flex-col gap-4 items-center p-5 bg-pt-purple-100/20 rounded-lg',
        className
      )}
    >
      <span className='text-center'>{timeText} reserve changes</span>
      <ReserveCardItem name='Liquidations' amount={validLiquidations} token={prizeToken} />
      <ReserveCardItem
        name='Manual Contributions'
        amount={validManualContributions}
        token={prizeToken}
      />
      <ReserveCardItem name='RNG Fees' amount={0n - validRngFees} token={prizeToken} />
      <ReserveCardItem
        name='Prize Backstops'
        amount={0n - validPrizeBackstops}
        token={prizeToken}
      />
      <hr className='w-full border-gray-400' />
      <ReserveCardItem
        name={`${timeText} changes`}
        amount={validLiquidations + validManualContributions - validRngFees - validPrizeBackstops}
        token={prizeToken}
        alwaysShow={true}
        nameClassName='capitalize'
      />
    </div>
  )
}

interface ReserveCardItemProps {
  name: string
  amount: bigint
  token: Token
  alwaysShow?: boolean
  className?: string
  nameClassName?: string
  amountClassName?: string
}

const ReserveCardItem = (props: ReserveCardItemProps) => {
  const { name, amount, token, alwaysShow, className, nameClassName, amountClassName } = props

  const formattedAmount = formatBigIntForDisplay(amount, token.decimals, {
    maximumFractionDigits: 0
  })

  if (!!amount || alwaysShow) {
    return (
      <div className={classNames('w-full flex justify-between whitespace-nowrap', className)}>
        <span className={classNames('text-2xl', nameClassName)}>{name}</span>
        <span
          className={classNames(
            'flex gap-1 items-center',
            {
              'text-green-600': amount > 0n,
              'text-red-600': amount < 0n
            },
            amountClassName
          )}
        >
          <span className='text-2xl'>
            {amount > 0n && '+'}
            {formattedAmount}
          </span>
          {token.symbol}
        </span>
      </div>
    )
  }

  return <></>
}
