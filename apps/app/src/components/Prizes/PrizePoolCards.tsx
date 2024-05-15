import classNames from 'classnames'
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
          'grid-cols-2': numPrizePools % 2 === 0 && numPrizePools % 3 !== 0,
          'grid-cols-3': numPrizePools % 3 === 0
        }
      )}
    >
      {Object.values(prizePools).map((prizePool) => (
        <PrizePoolCard
          key={`pp-${prizePool.id}`}
          prizePool={prizePool}
          className='w-full md:w-auto md:min-w-[22rem]'
        />
      ))}
    </div>
  )
}
