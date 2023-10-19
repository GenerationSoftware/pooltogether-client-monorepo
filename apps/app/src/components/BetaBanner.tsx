import { ExternalLink } from '@shared/ui'
import classNames from 'classnames'

interface BetaBannerProps {
  className?: string
}

export const BetaBanner = (props: BetaBannerProps) => {
  const { className } = props

  return (
    <div
      className={classNames(
        'w-full flex gap-2 items-center justify-center text-center p-2 bg-pt-transparent text-sm text-pt-purple-200 rounded-lg',
        className
      )}
    >
      <span className='px-1 font-grotesk font-semibold leading-5 text-red-600 border border-current rounded-[0.2rem]'>
        BETA
      </span>
      <ExternalLink href='https://app.cabana.fi' size='sm'>
        🚀 The public app has been launched! Migrate any Beta funds to the new and improved
        deployment.
      </ExternalLink>
    </div>
  )
}
