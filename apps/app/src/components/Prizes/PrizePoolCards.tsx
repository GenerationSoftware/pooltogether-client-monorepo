import classNames from 'classnames'
import Link from 'next/link'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'
import { PrizePoolCard } from './PrizePoolCard'

export const PrizePoolCards = () => {
  const prizePools = useSupportedPrizePools()
  const numPrizePools = Object.keys(prizePools).length

  return (
    <div
      className={classNames(
        'flex flex-col w-full items-center gap-4 rounded-lg md:grid md:w-auto md:p-4',
        {
          'grid-cols-1': numPrizePools === 1,
          'grid-cols-2': numPrizePools === 2 || numPrizePools === 4,
          'grid-cols-3': numPrizePools === 3 || numPrizePools >= 5
        }
      )}
    >
      {Object.values(prizePools).map((prizePool) => (
        <Link
          key={`pp-${prizePool.id}`}
          href={`/prizes?network=${prizePool.chainId}`}
          className='w-full'
        >
          <PrizePoolCard
            prizePool={prizePool}
            className='w-full hover:bg-pt-purple-50/20 md:w-auto md:min-w-[22rem]'
          />
        </Link>
      ))}
    </div>
  )
}
