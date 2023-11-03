import {
  useAllUserVaultBalances,
  useAllUserVaultDelegationBalances,
  useSelectedVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import classNames from 'classnames'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { AccountDelegationsCards } from './AccountDelegationsCards'
import { AccountDelegationsHeader } from './AccountDelegationsHeader'
import { AccountDelegationsTable } from './AccountDelegationsTable'

interface AccountDelegationsProps {
  address?: Address
  className?: string
}

export const AccountDelegations = (props: AccountDelegationsProps) => {
  const { address, className } = props

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  const { vaults } = useSelectedVaults()

  const { data: shareBalances } = useAllUserVaultBalances(vaults, userAddress as Address)

  const { data: delegationBalances } = useAllUserVaultDelegationBalances(
    vaults,
    userAddress as Address
  )

  const isNotEmpty = useMemo(() => {
    if (!!shareBalances && !!delegationBalances) {
      return Object.keys(shareBalances).some(
        (vaultId) =>
          (delegationBalances[vaultId] ?? 0n) - (shareBalances[vaultId]?.amount ?? 0n) > 0n
      )
    }
    return false
  }, [shareBalances, delegationBalances])

  if (typeof window !== undefined && !!userAddress && isNotEmpty) {
    return (
      <div
        className={classNames(
          'w-full max-w-xl flex flex-col gap-2 items-center md:gap-4 lg:max-w-none',
          className
        )}
      >
        <AccountDelegationsHeader address={userAddress} />
        <AccountDelegationsTable address={userAddress} className='hidden mt-4 lg:block' />
        <AccountDelegationsCards address={userAddress} className='lg:hidden' />
      </div>
    )
  }

  return <></>
}
