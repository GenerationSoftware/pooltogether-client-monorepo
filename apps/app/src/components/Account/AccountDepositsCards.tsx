import {
  useAllUserVaultBalances,
  useSelectedVaults,
  useSortedVaults
} from '@pooltogether/hyperstructure-react-hooks'
import classNames from 'classnames'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { AccountDepositsCard } from './AccountDepositsCard'

interface AccountDepositsCardsProps {
  address?: Address
  className?: string
}

export const AccountDepositsCards = (props: AccountDepositsCardsProps) => {
  const { address, className } = props

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  const { vaults } = useSelectedVaults()

  const { data: vaultBalances } = useAllUserVaultBalances(vaults, userAddress as Address)

  const { sortedVaults } = useSortedVaults(Object.values(vaults.vaults), {
    defaultSortId: 'userBalance'
  })

  return (
    <div className={classNames('w-full flex flex-col gap-4', className)}>
      {!!vaultBalances &&
        sortedVaults.map((vault) => {
          const shareBalance = vaultBalances[vault.id]?.amount ?? 0n
          if (shareBalance > 0n && vault.decimals !== undefined) {
            return <AccountDepositsCard key={vault.id} vault={vault} address={userAddress} />
          }
        })}
    </div>
  )
}
