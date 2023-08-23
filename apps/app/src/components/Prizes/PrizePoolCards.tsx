import { PrizePoolCard } from '@shared/react-components'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'

export const PrizePoolCards = () => {
  const prizePools = useSupportedPrizePools()
  const numPrizePools = Object.keys(prizePools).length

  const t = useTranslations('Common')

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
      {Object.values(prizePools).map((prizePool) => {
        return (
          <Link
            key={`pp-${prizePool.id}`}
            href={`/prizes?network=${prizePool.chainId}`}
            className='w-full'
          >
            <PrizePoolCard prizePool={prizePool} intl={t} />
          </Link>
        )
      })}
    </div>
  )
}
