import { Button } from '@shared/ui'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface PageNotFoundProps {
  className?: string
}

export const PageNotFound = (props: PageNotFoundProps) => {
  const { className } = props

  const t = useTranslations('Error')

  return (
    <div
      className={classNames(
        'flex flex-col gap-4 items-center justify-center p-4 text-center',
        className
      )}
    >
      <span className='text-3xl'>🤔 {t('hmmm')}</span>
      <h2 className='mb-8 font-bold text-3xl'>{t('pageNotFound')}</h2>
      <Link href='/' passHref={true}>
        <Button>
          <span className='text-xl'>{t('return')}</span>
        </Button>
      </Link>
    </div>
  )
}
