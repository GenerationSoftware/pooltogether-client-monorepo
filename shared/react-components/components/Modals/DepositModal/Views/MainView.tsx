import {
  getNiceNetworkNameByChainId,
  PrizePool,
  Vault
} from '@pooltogether/hyperstructure-client-js'
import { useVaultShareData } from '@pooltogether/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import { PrizePoolBadge } from '../../../Badges/PrizePoolBadge'
import { DepositForm } from '../../../Form/DepositForm'
import { NetworkFees } from '../../NetworkFees'
import { Odds } from '../../Odds'

interface MainViewProps {
  vault: Vault
  prizePool: PrizePool
}

export const MainView = (props: MainViewProps) => {
  const { vault, prizePool } = props

  const { data: shareData } = useVaultShareData(vault)

  const networkName = getNiceNetworkNameByChainId(vault.chainId)

  return (
    <div className='flex flex-col gap-6'>
      <span className='text-lg font-semibold text-center'>
        Deposit to {vault.name ?? `"${shareData?.name}"` ?? <Spinner />}{' '}
        <span className='hidden md:inline-block'>on {networkName}</span>
      </span>
      <PrizePoolBadge chainId={vault.chainId} hideBorder={true} className='!py-1 mx-auto' />
      <DepositForm vault={vault} showInputInfoRows={true} />
      <div className='flex flex-col gap-4 mx-auto md:flex-row md:gap-9'>
        <Odds vault={vault} prizePool={prizePool} />
        <NetworkFees vault={vault} show={['approve', 'deposit', 'withdraw']} />
      </div>
    </div>
  )
}
