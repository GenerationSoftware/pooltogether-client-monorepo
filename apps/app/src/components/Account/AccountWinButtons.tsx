import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { SubgraphPrize } from '@shared/types'
import { Button } from '@shared/ui'
import { getBlockExplorerName, getBlockExplorerUrl } from '@shared/utilities'
import { useTranslations } from 'next-intl'

interface AccountWinButtonsProps {
  win: SubgraphPrize & { chainId: number }
}

export const AccountWinButtons = (props: AccountWinButtonsProps) => {
  const { win } = props

  const t = useTranslations('Common')

  return (
    <div className='flex justify-end gap-2'>
      {/* TODO: current subgraph doesn't have tx hashes, cannot enable this button yet */}
      <Button
        href={getBlockExplorerUrl(win.chainId, '', 'tx')}
        target='_blank'
        color='transparent'
        disabled
      >
        <span className='inline-flex items-center gap-1 text-pt-purple-100'>
          {t('viewOn', { name: getBlockExplorerName(win.chainId) })}
          <ArrowTopRightOnSquareIcon className='h-5 w-5' />
        </span>
      </Button>
    </div>
  )
}
