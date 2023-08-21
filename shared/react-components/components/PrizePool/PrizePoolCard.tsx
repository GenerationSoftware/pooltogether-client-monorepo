import { PrizePool } from '@pooltogether/hyperstructure-client-js'
import { useGrandPrize } from '@pooltogether/hyperstructure-react-hooks'
import { Intl } from '@shared/types'
import { Card, Spinner } from '@shared/ui'
import { PrizePoolBadge } from '../Badges/PrizePoolBadge'
import { TokenAmount } from '../Currency/TokenAmount'
import { TokenValue } from '../Currency/TokenValue'

export interface PrizePoolCardProps {
  prizePool: PrizePool
  intl?: Intl<'prizePool' | 'grandPrize'>
}

export const PrizePoolCard = (props: PrizePoolCardProps) => {
  const { prizePool, intl } = props

  const { data: grandPrize, isFetched: isFetchedGrandPrize } = useGrandPrize(prizePool, {
    useCurrentPrizeSizes: true
  })

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
        textClassName='text-2xl font-grotesk font-medium whitespace-nowrap md:text-3xl'
      />
      <div className='flex flex-col gap-0.5 text-center text-pt-purple-100 md:text-start'>
        <span className='text-xs uppercase md:text-sm'>
          {intl?.('grandPrize') ?? 'Grand Prize'}
        </span>
        {isFetchedGrandPrize ? (
          !!grandPrize ? (
            <>
              <span className='text-2xl text-pt-teal md:text-4xl'>
                <TokenValue token={grandPrize} hideZeroes={true} fallback={<></>} />
              </span>
              <span className='hidden font-light md:block'>
                ≈ <TokenAmount token={grandPrize} hideZeroes={true} />
              </span>
            </>
          ) : (
            '?'
          )
        ) : (
          <Spinner />
        )}
      </div>
    </Card>
  )
}
