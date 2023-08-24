import {
  useAllUserVaultDelegationBalances,
  useSelectedVaults
} from '@pooltogether/hyperstructure-react-hooks'
import classNames from 'classnames'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useSortedVaultsByDelegatedAmount } from '@hooks/useSortedVaultsByDelegatedAmount'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'
import { AccountDelegationsCard } from './AccountDelegationsCard'

interface AccountDelegationsCardsProps {
  address?: Address
  className?: string
}

export const AccountDelegationsCards = (props: AccountDelegationsCardsProps) => {
  const { address, className } = props

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  const prizePools = useSupportedPrizePools()
  const prizePoolsArray = Object.values(prizePools)

  const { data: delegationBalances } = useAllUserVaultDelegationBalances(
    prizePoolsArray,
    userAddress as Address
  )

  const { vaults } = useSelectedVaults()

  const { data: sortedVaults } = useSortedVaultsByDelegatedAmount(
    Object.values(vaults.vaults),
    userAddress as Address
  )

  return (
    <div className={classNames('w-full flex flex-col gap-4', className)}>
      {!!delegationBalances &&
        sortedVaults.map((vault) => {
          const delegationBalance =
            delegationBalances[vault.chainId]?.[vault.address.toLowerCase() as Address] ?? 0n
          if (delegationBalance > 0n && vault.decimals !== undefined) {
            return <AccountDelegationsCard key={vault.id} vault={vault} address={userAddress} />
          }
        })}
    </div>
  )
}
