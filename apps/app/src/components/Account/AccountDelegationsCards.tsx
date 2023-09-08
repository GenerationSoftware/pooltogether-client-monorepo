import {
  useAllUserVaultBalances,
  useAllUserVaultDelegationBalances,
  useSelectedVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import classNames from 'classnames'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useSortedVaultsByDelegatedAmount } from '@hooks/useSortedVaultsByDelegatedAmount'
import { AccountDelegationsCard } from './AccountDelegationsCard'

interface AccountDelegationsCardsProps {
  address?: Address
  className?: string
}

export const AccountDelegationsCards = (props: AccountDelegationsCardsProps) => {
  const { address, className } = props

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  const { vaults } = useSelectedVaults()

  const { data: shareBalances } = useAllUserVaultBalances(vaults, userAddress as Address)

  const { data: delegationBalances } = useAllUserVaultDelegationBalances(
    vaults,
    userAddress as Address
  )

  const { data: sortedVaults } = useSortedVaultsByDelegatedAmount(
    Object.values(vaults.vaults),
    userAddress as Address
  )

  return (
    <div className={classNames('w-full flex flex-col gap-4', className)}>
      {!!shareBalances &&
        !!delegationBalances &&
        sortedVaults.map((vault) => {
          const delegationBalance =
            (delegationBalances[vault.id] ?? 0n) - (shareBalances[vault.id]?.amount ?? 0n)
          if (delegationBalance > 0n && vault.decimals !== undefined) {
            return <AccountDelegationsCard key={vault.id} vault={vault} address={userAddress} />
          }
        })}
    </div>
  )
}
