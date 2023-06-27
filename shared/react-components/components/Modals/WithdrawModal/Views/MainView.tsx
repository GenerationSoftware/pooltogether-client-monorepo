import { getNiceNetworkNameByChainId, Vault } from '@pooltogether/hyperstructure-client-js'
import { Spinner } from '@shared/ui'
import { NetworkBadge } from '../../../Badges/NetworkBadge'
import { WithdrawForm } from '../../../Form/WithdrawForm'
import { NetworkFees } from '../../NetworkFees'

interface MainViewProps {
  vault: Vault
}

export const MainView = (props: MainViewProps) => {
  const { vault } = props

  const networkName = getNiceNetworkNameByChainId(vault.chainId)

  return (
    <div className='flex flex-col gap-6'>
      <span className='text-lg font-semibold text-center'>
        Withdraw from {vault.name ?? <Spinner />}{' '}
        <span className='hidden md:inline-block'>on {networkName}</span>
      </span>
      <NetworkBadge
        chainId={vault.chainId}
        appendText='Prize Pool'
        hideBorder={true}
        className='!py-1 mx-auto'
      />
      {!!vault.shareData && !!vault.tokenData && vault.decimals !== undefined && (
        <WithdrawForm vault={vault} showInputInfoRows={true} />
      )}
      <NetworkFees vault={vault} show={['withdraw']} />
    </div>
  )
}
