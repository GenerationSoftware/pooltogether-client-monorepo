import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { useIsDismissed } from '@shared/generic-react-hooks'
import { Button, LINKS } from '@shared/ui'
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
        'relative w-full max-w-[36rem] flex flex-col gap-3 items-center p-4 bg-[#412375] text-pt-purple-100 rounded-lg',
        'lg:max-w-none lg:flex-row lg:gap-6',
        { hidden: isDismissed },
        className
      )}
    >
      <div className='flex gap-2 items-center'>
        <ExclamationCircleIcon className='h-5 w-auto text-[#412375] fill-pt-warning-light lg:h-6' />
        <span className='text-lg font-semibold whitespace-nowrap lg:text-xl'>
          {t_common('learnAboutRisks')}:
        </span>
      </div>
      <span className='grow text-center text-sm lg:text-start lg:text-base'>
        {t_vaults('disclaimer')}
      </span>
      {/* TODO: better link to risks section of docs */}
      <Button href={LINKS.docs} target='_blank' color='transparent'>
        <span className='text-xs whitespace-nowrap lg:text-sm'>{t_common('readDocs')}</span>
      </Button>
      <XMarkIcon
        className='absolute right-4 h-5 w-5 shrink-0 cursor-pointer lg:relative lg:inset-auto'
        onClick={dismiss}
      />
    </div>
  )
}
