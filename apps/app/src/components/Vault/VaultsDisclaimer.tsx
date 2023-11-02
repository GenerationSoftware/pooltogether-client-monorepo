import { XMarkIcon } from '@heroicons/react/24/solid'
import { useIsDismissed } from '@shared/generic-react-hooks'
import { AlertIcon } from '@shared/react-components'
import { Button, ExternalLink, LINKS } from '@shared/ui'
import classNames from 'classnames'
import { useTranslations } from 'next-intl'

interface VaultsDisclaimerProps {
  className?: string
}

export const VaultsDisclaimer = (props: VaultsDisclaimerProps) => {
  const { className } = props

  const t_common = useTranslations('Common')
  const t_vaults = useTranslations('Vaults')

  const { isDismissed, dismiss } = useIsDismissed('vaultsDisclaimer')

  return (
    <div
      className={classNames(
        'relative w-full max-w-[36rem] flex flex-col gap-4 p-4 bg-pt-transparent text-pt-purple-100 rounded-lg',
        'lg:max-w-none lg:flex-row lg:items-center lg:px-10',
        { hidden: isDismissed },
        className
      )}
    >
      <div className='flex gap-2 items-center'>
        <AlertIcon className='w-5 h-5' />
        <span className='text-base font-semibold whitespace-nowrap'>
          {t_common('learnAboutRisks')}:
        </span>
        <XMarkIcon
          className='w-7 h-7 shrink-0 ml-auto cursor-pointer lg:hidden'
          onClick={dismiss}
        />
      </div>
      <span className='inline-block grow text-xs lg:text-base'>
        {t_vaults.rich('disclaimer', {
          link: (chunks) => (
            <ExternalLink
              href={LINKS.risks}
              className='text-xs text-pt-purple-300 lg:text-base'
              iconClassName='!h-4 !w-4'
            >
              {chunks}
            </ExternalLink>
          )
        })}
      </span>
      <a
        href={LINKS.termsOfService}
        target='_blank'
        className='mx-auto text-xs text-blue-500 whitespace-nowrap lg:hidden'
      >
        {t_common('termsOfService')}
      </a>
      <Button
        href={LINKS.termsOfService}
        target='_blank'
        color='transparent'
        className='hidden lg:block'
      >
        <span className='text-sm whitespace-nowrap'>{t_common('termsOfService')}</span>
      </Button>
      <XMarkIcon className='hidden w-7 h-7 shrink-0 cursor-pointer lg:block' onClick={dismiss} />
    </div>
  )
}
