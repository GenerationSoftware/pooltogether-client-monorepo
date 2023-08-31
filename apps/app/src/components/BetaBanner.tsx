import { ExternalLink } from '@shared/ui'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'

interface BetaBannerProps {
  className?: string
}

export const BetaBanner = (props: BetaBannerProps) => {
  const { className } = props

  const t = useTranslations('Beta')

  return (
    <div
      className={classNames(
        'w-full flex gap-2 items-center justify-center text-center p-2 bg-pt-transparent text-sm text-pt-purple-200 rounded-lg',
        className
      )}
    >
      <span className='px-1 font-grotesk font-semibold leading-5 text-red-600 border border-current rounded-[0.2rem]'>
        {t('beta').toUpperCase()}
      </span>
      <ExternalLink
        href='https://gov.pooltogether.com/t/v5-private-beta-launch-information/3021'
        size='sm'
      >
        {t('learnMore')}
      </ExternalLink>
    </div>
  )
}
