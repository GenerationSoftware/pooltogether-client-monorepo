import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useUserVaultTokenBalance } from '@generationsoftware/hyperstructure-react-hooks'
import { TokenValueAndAmount } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import { Address, formatUnits } from 'viem'
import { useAccount } from 'wagmi'

interface AccountVaultBalanceProps {
  vault: Vault
  address?: Address
  className?: string
}

export const AccountVaultBalance = (props: AccountVaultBalanceProps) => {
  const { vault, address, className } = props

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  const { data: tokenBalance, isFetched: isFetchedTokenBalance } = useUserVaultTokenBalance(
    vault,
    userAddress as Address
  )

  if (!userAddress) {
    return <>-</>
  }

  if (!isFetchedTokenBalance) {
    return <Spinner />
  }

  if (tokenBalance === undefined) {
    return <>?</>
  }

  if (tokenBalance.amount > 0n) {
    const shiftedAmount = parseFloat(formatUnits(tokenBalance.amount, tokenBalance.decimals))

    return (
      <TokenValueAndAmount
        token={tokenBalance}
        className={className}
        valueClassName='text-sm md:text-base'
        amountClassName='text-xs md:text-sm'
        valueOptions={{ hideZeroes: true }}
        amountOptions={shiftedAmount > 1e3 ? { hideZeroes: true } : { maximumFractionDigits: 2 }}
      />
    )
  }

  return <>-</>
}
