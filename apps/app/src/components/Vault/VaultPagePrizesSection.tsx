import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import { PrizePoolPrizesCard } from '@components/Prizes/PrizePoolPrizesCard'
import { VaultPageCard } from './VaultPageCard'

interface VaultPagePrizesSectionProps {
  prizePool: PrizePool
  className?: string
}

export const VaultPagePrizesSection = (props: VaultPagePrizesSectionProps) => {
  const { prizePool, className } = props

  const t_prizes = useTranslations('Prizes')

  // TODO: better title?
  return (
    <VaultPageCard
      title={t_prizes('currentPrizes')}
      className='!p-0'
      wrapperClassName={classNames('bg-transparent shadow-none', className)}
    >
      <PrizePoolPrizesCard
        prizePool={prizePool}
        className='bg-transparent shadow-none'
        innerClassName='!p-0'
        networkClassName='hidden'
        headersClassName='hidden'
        prizeClassName='!pl-0 pr-3 !text-2xl !text-pt-purple-100 font-semibold md:!text-3xl'
        frequencyClassName='!pr-0 pl-3 !text-pt-purple-300'
      />
    </VaultPageCard>
  )
}
