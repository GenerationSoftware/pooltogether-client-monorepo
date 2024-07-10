import { Spinner } from '@shared/ui'
import classNames from 'classnames'

interface StatCardsProps {
  cards: {
    id: string
    title: string
    subtitle?: string
    value?: string
    unit?: string
    className?: string
    titleClassName?: string
    subtitleClassName?: string
    valueClassName?: string
    unitClassName?: string
  }[]
  className?: string
}

export const StatCards = (props: StatCardsProps) => {
  const { cards, className } = props

  return (
    <div
      className={classNames('w-full grid gap-8 px-4 py-6 bg-pt-transparent rounded-2xl', className)}
    >
      {cards.map((card) => (
        <StatCard key={`stat-card-${card.id}`} {...card} />
      ))}
    </div>
  )
}

const StatCard = (props: StatCardsProps['cards'][number]) => {
  const {
    title,
    subtitle,
    value,
    unit,
    className,
    titleClassName,
    subtitleClassName,
    valueClassName,
    unitClassName
  } = props

  return (
    <div className={classNames('flex flex-col items-center gap-2', className)}>
      <div className='flex flex-col items-center text-center text-sm text-pt-purple-100'>
        <span className={classNames('font-bold', titleClassName)}>{title}</span>
        <span className={classNames('h-5', subtitleClassName)}>{subtitle}</span>
      </div>
      <div className='w-full h-[4.25rem] flex items-center justify-center p-4 bg-pt-purple-300 rounded-lg'>
        {value !== undefined ? (
          <div className='flex items-end gap-1 font-bold'>
            <span className={classNames('text-3xl text-pt-purple-700', valueClassName)}>
              {value}
            </span>
            {!!unit && (
              <span className={classNames('mt-auto text-xl text-pt-purple-500', unitClassName)}>
                {unit}
              </span>
            )}
          </div>
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  )
}
