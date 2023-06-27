import { ExternalLink } from '@shared/ui'
import { Layout } from '@components/Layout'
import { PrizePoolDisplay } from '@components/Prizes/PrizePoolDisplay'
import { PrizePoolWinners } from '@components/Prizes/PrizePoolWinners'

export default function PrizesPage() {
  return (
    <Layout className='gap-8'>
      <span className='hidden text-6xl py-2 md:block'>🏆</span>
      <PrizePoolDisplay />
      {/* TODO: add link */}
      <ExternalLink
        href='#'
        text='Learn more about how prizes work'
        size='xs'
        className='text-pt-purple-300 md:text-base'
        iconClassName='md:h-5 md:w-5'
      />
      <PrizePoolWinners />
    </Layout>
  )
}
