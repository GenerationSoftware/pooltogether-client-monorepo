import {
  getNiceNetworkNameByChainId,
  PrizePool,
  Vault
} from '@pooltogether/hyperstructure-client-js'
import { Spinner } from '@shared/ui'
import { NetworkBadge } from '../../../Badges/NetworkBadge'
import { DepositForm } from '../../../Form/DepositForm'
import { NetworkFees } from '../../NetworkFees'
import { Odds } from '../../Odds'

interface MainViewProps {
  vault: Vault
  prizePool: PrizePool
}

export const MainView = (props: MainViewProps) => {
  const { vault, prizePool } = props

  const networkName = getNiceNetworkNameByChainId(vault.chainId)

  return (
    <div className='flex flex-col gap-6'>
      <span className='text-lg font-semibold text-center'>
        Deposit to {vault.name ?? <Spinner />}{' '}
        <span className='hidden md:inline-block'>on {networkName}</span>
      </span>
      <NetworkBadge
        chainId={vault.chainId}
        appendText='Prize Pool'
        hideBorder={true}
        className='!py-1 mx-auto'
      />
      {!!vault.shareData && !!vault.tokenData && vault.decimals !== undefined && (
        <DepositForm vault={vault} showInputInfoRows={true} />
      )}
      <div className='flex flex-col gap-4 mx-auto md:flex-row md:gap-9'>
        <Odds vault={vault} prizePool={prizePool} />
        <NetworkFees vault={vault} show={['approve', 'deposit']} />
      </div>
    </div>
  )
}
