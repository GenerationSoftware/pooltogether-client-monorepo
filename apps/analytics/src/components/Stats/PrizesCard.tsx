import { formatNumberForDisplay, PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useAllPrizeInfo,
  usePrizeDrawWinners,
  usePrizeTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import classNames from 'classnames'
import { ReactNode, useMemo } from 'react'
import { formatUnits } from 'viem'

interface PrizesCardProps {
  prizePool: PrizePool
  className?: string
}

export const PrizesCard = (props: PrizesCardProps) => {
  const { prizePool, className } = props

  const { data: allPrizeInfo } = useAllPrizeInfo([prizePool])
  const { data: prizeToken } = usePrizeTokenData(prizePool)

  const prizeAmounts = useMemo(() => {
    if (!!prizeToken) {
      return allPrizeInfo[prizePool.id]?.map((prizeInfo) =>
        parseFloat(formatUnits(prizeInfo.amount.current, prizeToken.decimals))
      )
    }
  }, [allPrizeInfo, prizeToken])

  const { data: draws } = usePrizeDrawWinners(prizePool)

  const totalPrizes = useMemo(() => {
    if (!!draws && !!prizeToken) {
      let numPrizes = 0
      let numPrizesWithCanary = 0
      let sumAmount = 0n

      draws.forEach((draw) => {
        draw.prizeClaims.forEach((claim) => {
          numPrizesWithCanary++

          if (!!claim.payout) {
            numPrizes++
            sumAmount += claim.payout
          }
        })
      })

      return {
        num: numPrizes,
        numWithCanary: numPrizesWithCanary,
        amount: parseFloat(formatUnits(sumAmount, prizeToken.decimals))
      }
    }
  }, [draws, prizeToken])

  return (
    <div className={classNames('flex flex-col p-4 bg-pt-transparent rounded-2xl', className)}>
      <span className='text-pt-purple-400'>Prizes</span>
      <DataRow
        name={`Total Prizes Amount Awarded`}
        value={
          !!totalPrizes && !!prizeToken ? (
            <>
              <span>
                {formatNumberForDisplay(totalPrizes.amount, { maximumFractionDigits: 4 })}
              </span>{' '}
              <span className='text-sm text-pt-purple-100'>{prizeToken.symbol}</span>
            </>
          ) : undefined
        }
      />
      <DataRow
        name={`Total Prizes Awarded`}
        value={!!totalPrizes ? formatNumberForDisplay(totalPrizes.num) : undefined}
      />
      <DataRow
        name={`Total Prizes Awarded (Including Canary)`}
        value={!!totalPrizes ? formatNumberForDisplay(totalPrizes.numWithCanary) : undefined}
      />
      <hr className='my-2 border-pt-purple-200/50' />
      {!!prizeAmounts && !!prizeToken ? (
        <>
          {prizeAmounts.map((prizeAmount, tier) => {
            const tierName =
              tier === 0
                ? 'Grand Prize'
                : tier >= prizeAmounts.length - 2
                ? 'Canary'
                : `Tier ${tier}`
            const formattedAmount = formatNumberForDisplay(prizeAmount, {
              maximumFractionDigits: 4
            })

            return (
              <DataRow
                key={`prize-tier-${tier}`}
                name={tierName}
                value={
                  <>
                    <span>{formattedAmount === '0' ? '< 0.0001' : formattedAmount}</span>{' '}
                    <span className='text-sm text-pt-purple-100'>{prizeToken.symbol}</span>
                  </>
                }
              />
            )
          })}
        </>
      ) : (
        <Spinner />
      )}
    </div>
  )
}

interface DataRowProps {
  name: string
  value: ReactNode | undefined
  className?: string
}

const DataRow = (props: DataRowProps) => {
  const { name, value, className } = props

  return (
    <div className={classNames('flex justify-between items-center gap-4', className)}>
      <span>{name}</span>
      <span>{value ?? <Spinner />}</span>
    </div>
  )
}
