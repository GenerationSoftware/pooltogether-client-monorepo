import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { useVault } from '@generationsoftware/hyperstructure-react-hooks'
import { VaultBadge } from '@shared/react-components'
import { Win } from '@shared/types'
import { ExternalLink } from '@shared/ui'
import { getSimpleDate } from '@shared/utilities'
import { getBlockExplorerUrl } from '@shared/utilities'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { AccountWinAmount } from './AccountWinAmount'

interface AccountWinCardProps {
  win: Win
  prizePool: PrizePool
}

export const AccountWinCard = (props: AccountWinCardProps) => {
  const { win, prizePool } = props

  const t = useTranslations('Common')

  const vault = useVault({ chainId: win.chainId, address: win.vault })

  return (
    <div className='flex items-center gap-3 bg-pt-transparent rounded-lg p-3'>
      <Link href={`/vault/${vault.chainId}/${vault.address}`}>
        <VaultBadge
          vault={vault}
          onClick={() => {}}
          nameClassName='max-[500px]:hidden'
          symbolClassName='max-[380px]:hidden'
        />
      </Link>
      <span className='hidden text-sm sm:block'>{getSimpleDate(win.timestamp)}</span>
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
        className='!items-end'
        valueClassName='font-semibold'
        amountClassName='text-right font-xs font-light'
      />
    </div>
  )
}
