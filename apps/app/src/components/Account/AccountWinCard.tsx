import { PrizePool } from '@pooltogether/hyperstructure-client-js'
import { NetworkIcon } from '@shared/react-components'
import { SubgraphPrize } from '@shared/types'
import { ExternalLink } from '@shared/ui'
import { getSimpleDate } from '@shared/utilities'
import { getBlockExplorerUrl } from '@shared/utilities'
import { useTranslations } from 'next-intl'
import { AccountWinAmount } from './AccountWinAmount'

interface AccountWinCardProps {
  win: SubgraphPrize & { chainId: number }
  prizePool: PrizePool
}

export const AccountWinCard = (props: AccountWinCardProps) => {
  const { win, prizePool } = props

  const t = useTranslations('Common')

  return (
    <div className='flex items-center gap-3 bg-pt-transparent rounded-lg p-3'>
      <NetworkIcon chainId={win.chainId} className='h-6 w-6' />
      <span className='text-sm'>{getSimpleDate(win.timestamp)}</span>
      {/* TODO: add txHash once subgraph has it */}
      <ExternalLink
        // href={getBlockExplorerUrl(win.chainId, win.txHash, 'tx')}
        href={getBlockExplorerUrl(win.chainId, '', 'tx')}
        text={t('viewTx')}
        size='xs'
        className='grow text-pt-purple-200'
      />
      <AccountWinAmount
        prizePool={prizePool}
        amount={win.payout}
        className='!items-end lg:!items-center'
        valueClassName='font-semibold lg:font-normal'
        amountClassName='font-xs font-light lg:font-sm lg:font-normal'
      />
    </div>
  )
}
