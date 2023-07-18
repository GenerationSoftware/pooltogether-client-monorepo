import { formatBigIntForDisplay, PrizePool } from '@pooltogether/hyperstructure-client-js'
import { useAllPrizeInfo, usePrizeTokenData } from '@pooltogether/hyperstructure-react-hooks'
import { Intl } from '@shared/types'
import { Card, Spinner } from '@shared/ui'
import { PrizePoolBadge } from '../Badges/PrizePoolBadge'
import { TokenValue } from '../Currency/TokenValue'

export interface PrizePoolCardProps {
  prizePool: PrizePool
  intl?: Intl<'prizePool' | 'grandPrize'>
}

export const PrizePoolCard = (props: PrizePoolCardProps) => {
  const { prizePool, intl } = props

  const { data: allPrizeInfo, isFetched: isFetchedAllPrizeInfo } = useAllPrizeInfo([prizePool])
  const grandPrize =
    isFetchedAllPrizeInfo && !!allPrizeInfo ? allPrizeInfo[prizePool.id]?.[0].amount ?? 0n : 0n

  const { data: prizeTokenData, isFetched: isFetchedPrizeTokenData } = usePrizeTokenData(prizePool)

  return (
    <Card
      wrapperClassName='hover:bg-pt-purple-50/20'
      className='gap-3 items-center md:gap-16 md:items-start'
    >
      <PrizePoolBadge
        chainId={prizePool.chainId}
        hideBg={true}
        intl={intl}
        className='gap-2 !p-0'
        iconClassName='h-8 w-8'
        textClassName='font-semibold whitespace-nowrap md:text-2xl'
      />
      <div className='flex flex-col gap-0.5 text-center text-pt-purple-100 md:text-start'>
        <span className='text-xs uppercase md:text-sm'>
          {intl?.('grandPrize') ?? 'Grand Prize'}
        </span>
        {isFetchedAllPrizeInfo && isFetchedPrizeTokenData && !!prizeTokenData ? (
          <>
            <span className='text-2xl text-pt-teal md:text-4xl'>
              <TokenValue token={{ ...prizeTokenData, amount: grandPrize }} hideZeroes={true} />
            </span>
            <span className='hidden font-light md:block'>
              ≈ {formatBigIntForDisplay(grandPrize, prizeTokenData.decimals, { hideZeroes: true })}{' '}
              POOL
            </span>
          </>
        ) : (
          <Spinner />
        )}
      </div>
    </Card>
  )
}
