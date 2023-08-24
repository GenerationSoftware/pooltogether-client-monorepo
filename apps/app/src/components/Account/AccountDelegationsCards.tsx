import {
  useAllUserBalanceUpdates,
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

  const { data: userBalanceUpdates } = useAllUserBalanceUpdates(
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
      {!!userBalanceUpdates &&
        sortedVaults.map((vault) => {
          const latestObservation =
            userBalanceUpdates[vault.chainId]?.[vault.address.toLowerCase() as Address]?.[0]
          const delegatedAmount = !!latestObservation
            ? latestObservation.delegateBalance - latestObservation.balance
            : 0n
          if (delegatedAmount > 0n && vault.decimals !== undefined) {
            return <AccountDelegationsCard key={vault.id} vault={vault} address={userAddress} />
          }
        })}
    </div>
  )
}
