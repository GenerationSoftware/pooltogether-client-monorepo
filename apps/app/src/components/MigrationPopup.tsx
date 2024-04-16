import { useIsDismissed } from '@shared/generic-react-hooks'
import { Button, Modal } from '@shared/ui'
import { LINKS } from '@shared/utilities'
import { useTranslations } from 'next-intl'

export const MigrationPopup = () => {
  const t = useTranslations('Common.greatMigration')

  const { isDismissed, dismiss } = useIsDismissed('greatMigrationPopup')

  // TODO: calculate highest apr in bonus rewards
  const highestRewardsApr = 10

  if (isDismissed) {
    return <></>
  }

  // TODO: style on mobile so it doesn't break :3
  return (
    <Modal
      bodyContent={
        <div className='relative w-[768px] h-[500px] flex flex-col items-center justify-between gap-4 py-12 rounded-3xl isolate overflow-hidden'>
          <object
            type='image/svg+xml'
            data='/greatMigration.svg'
            className='absolute top-0 -z-10'
          />
          <div className='flex flex-col gap-4 text-center'>
            <span className='text-5xl text-pt-purple-200'>
              {t.rich('joinTitle', {
                highlight: (chunks) => <span className='text-pt-purple-50'>{chunks}</span>
              })}
            </span>
            <span className='text-2xl'>
              {t.rich('earnUpTo', {
                apr: highestRewardsApr,
                highlight: (chunks) => <span className='text-pt-teal'>{chunks}</span>
              })}
            </span>
          </div>
          <Button href={LINKS.migrations} target='_blank' size='lg' className='min-w-[16rem]'>
            {t('joinButton')}
          </Button>
        </div>
      }
      className='p-12 !rounded-3xl md:!w-auto md:max-w-none'
      onClose={dismiss}
      label='great-migration-popup'
      hideHeader={true}
      mobileStyle='tab'
    />
  )
}
