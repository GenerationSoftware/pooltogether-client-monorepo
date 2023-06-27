import {
  getBlockExplorerUrl,
  PrizePool,
  SubgraphPrizePoolAccount
} from '@pooltogether/hyperstructure-client-js'
import { NetworkIcon } from '@shared/react-components'
import { ExternalLink } from '@shared/ui'
import { AccountWinAmount } from './AccountWinAmount'

interface AccountWinCardProps {
  win: SubgraphPrizePoolAccount['prizesReceived'][0] & { chainId: number }
  prizePool: PrizePool
}

export const AccountWinCard = (props: AccountWinCardProps) => {
  const { win, prizePool } = props

  return (
    <div className='flex items-center gap-3 bg-pt-transparent rounded-lg p-3'>
      <NetworkIcon chainId={win.chainId} className='h-6 w-6' />
      <span className='text-sm'>Draw #{win.draw.id}</span>
      {/* TODO: add txHash once subgraph has it */}
      <ExternalLink
        // href={getBlockExplorerUrl(win.chainId, win.txHash, 'tx')}
        href={getBlockExplorerUrl(win.chainId, '', 'tx')}
        text='View TX'
        size='xs'
        className='grow text-pt-purple-200'
      />
      <AccountWinAmount
        prizePool={prizePool}
        amount={BigInt(win.payout)}
        className='!items-end lg:!items-center'
        valueClassName='font-semibold lg:font-normal'
        amountClassName='font-xs font-light lg:font-sm lg:font-normal'
      />
    </div>
  )
}
