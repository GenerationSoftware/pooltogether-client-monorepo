import {
  getBlockExplorerName,
  getBlockExplorerUrl,
  SubgraphPrizePoolAccount
} from '@pooltogether/hyperstructure-client-js'
import { Button, ExternalLink } from '@shared/ui'

interface AccountWinButtonsProps {
  win: SubgraphPrizePoolAccount['prizesReceived'][0] & { chainId: number }
}

export const AccountWinButtons = (props: AccountWinButtonsProps) => {
  const { win } = props

  return (
    <div className='flex justify-end gap-2'>
      {/* TODO: current subgraph doesn't have tx hashes, cannot enable this button yet */}
      {/* TODO: this doesn't work (the outsides of the button are unclickable) */}
      <Button color='transparent' disabled>
        <ExternalLink
          // href={getBlockExplorerUrl(win.chainId, win.txHash, 'tx')}
          href={getBlockExplorerUrl(win.chainId, '', 'tx')}
          text={`View on ${getBlockExplorerName(win.chainId)}`}
          size='sm'
          className='text-pt-purple-100'
        />
      </Button>
    </div>
  )
}
