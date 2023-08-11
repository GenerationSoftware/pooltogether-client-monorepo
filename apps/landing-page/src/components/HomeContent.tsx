import classNames from 'classnames'
import { DocsSection } from './DocsSection'
import { FaqSection } from './FaqSection'
import { HowItWorksSection } from './HowItWorksSection'

interface HomeContentProps {
  className?: string
}

export const HomeContent = (props: HomeContentProps) => {
  const { className } = props

  return (
    <div
      className={classNames(
        'w-full flex flex-col gap-24 items-center px-16 bg-pt-purple-600',
        className
      )}
    >
      <HowItWorksSection />
      <DocsSection />
      <FaqSection className='max-w-5xl' />
    </div>
  )
}
