import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { Win } from '@shared/types'
import { Button } from '@shared/ui'
import { getBlockExplorerName, getBlockExplorerUrl } from '@shared/utilities'
import { useTranslations } from 'next-intl'

interface AccountWinButtonsProps {
  win: Win
}

export const AccountWinButtons = (props: AccountWinButtonsProps) => {
  const { win } = props

  const t = useTranslations('Common')

  return (
    <div className='flex justify-end gap-2'>
      <Button
        href={getBlockExplorerUrl(win.chainId, win.txHash, 'tx')}
        target='_blank'
        color='transparent'
      >
        <span className='inline-flex items-center gap-1 text-pt-purple-100'>
          {t('viewOn', { name: getBlockExplorerName(win.chainId) })}
          <ArrowTopRightOnSquareIcon className='h-5 w-5' />
        </span>
      </Button>
    </div>
  )
}
