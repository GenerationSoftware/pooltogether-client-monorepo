import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NetworkIcon } from '@shared/react-components'
import { Win } from '@shared/types'
import { ExternalLink } from '@shared/ui'
import { getSimpleDate } from '@shared/utilities'
import { getBlockExplorerUrl } from '@shared/utilities'
import { useTranslations } from 'next-intl'
import { AccountWinAmount } from './AccountWinAmount'

interface AccountWinCardProps {
  win: Win
  prizePool: PrizePool
}

export const AccountWinCard = (props: AccountWinCardProps) => {
  const { win, prizePool } = props

  const t = useTranslations('Common')

  return (
    <div className='flex items-center gap-3 bg-pt-transparent rounded-lg p-3'>
      <NetworkIcon chainId={win.chainId} className='h-6 w-6' />
      <span className='text-sm'>{getSimpleDate(win.timestamp)}</span>
      <ExternalLink
        href={getBlockExplorerUrl(win.chainId, win.txHash, 'tx')}
        size='xs'
        className='grow text-pt-purple-200'
      >
        {t('viewTx')}
      </ExternalLink>
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
