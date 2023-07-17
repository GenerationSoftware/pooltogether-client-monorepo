import {
  getBlockExplorerName,
  getBlockExplorerUrl,
  SubgraphPrizePoolAccount
} from '@pooltogether/hyperstructure-client-js'
import { Button, ExternalLink } from '@shared/ui'
import { useTranslations } from 'next-intl'

interface AccountWinButtonsProps {
  win: SubgraphPrizePoolAccount['prizesReceived'][0] & { chainId: number }
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
        <ExternalLink
          href='#'
          text={t('viewOn', { name: getBlockExplorerName(win.chainId) })}
          size='sm'
          className='text-pt-purple-100 pointer-events-none'
        />
      </Button>
    </div>
  )
}
