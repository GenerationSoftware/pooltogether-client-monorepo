import { Vault } from '@pooltogether/hyperstructure-client-js'
import { useUserVaultTokenBalance } from '@pooltogether/hyperstructure-react-hooks'
import { PrizePowerTooltip, VaultBadge } from '@shared/react-components'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import { AccountVaultBalance } from '@components/Account/AccountVaultBalance'
import { VaultButtons } from './VaultButtons'
import { VaultPrizePower } from './VaultPrizePower'
import { VaultTotalDeposits } from './VaultTotalDeposits'

interface VaultCardProps {
  vault: Vault
}

export const VaultCard = (props: VaultCardProps) => {
  const { vault } = props

  const router = useRouter()

  const { address: userAddress } = useAccount()

  const { data: tokenBalance } = useUserVaultTokenBalance(vault, userAddress as `0x${string}`)

  return (
    <div className='flex flex-col gap-4 bg-pt-transparent rounded-lg px-3 pt-3 pb-6'>
      <span>
        <VaultBadge vault={vault} onClick={() => router.push(`/vault/${vault.id}`)} />
      </span>
      <div className='w-full flex flex-col gap-1 px-3'>
        {!!tokenBalance && tokenBalance.amount > 0n && (
          <div className='flex items-center justify-between'>
            <span className='text-xs text-pt-purple-200'>My Balance</span>
            <AccountVaultBalance vault={vault} className='!flex-row gap-1' />
          </div>
        )}
        <div className='flex items-center justify-between'>
          <span className='flex gap-1 items-center text-xs text-pt-purple-200'>
            Prize Power <PrizePowerTooltip className='text-xs' />
          </span>
          <span className='text-sm'>
            <VaultPrizePower vault={vault} />
          </span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-xs text-pt-purple-200'>Total Deposits</span>
          <span className='text-sm'>
            <VaultTotalDeposits vault={vault} />
          </span>
        </div>
      </div>
      <VaultButtons vault={vault} fullSized={true} className='w-full justify-center' />
    </div>
  )
}
