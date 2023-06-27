import { Vault } from '@pooltogether/hyperstructure-client-js'
import { useUserVaultTokenBalance } from '@pooltogether/hyperstructure-react-hooks'
import { TokenValueAndAmount } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import { useAccount } from 'wagmi'

interface AccountVaultBalanceProps {
  vault: Vault
  className?: string
}

export const AccountVaultBalance = (props: AccountVaultBalanceProps) => {
  const { vault, className } = props

  const { address: userAddress } = useAccount()

  const { data: tokenBalance } = useUserVaultTokenBalance(vault, userAddress as `0x${string}`)

  if (!userAddress) {
    return <>-</>
  }

  if (!tokenBalance) {
    return <Spinner />
  }

  if (tokenBalance.amount > 0n) {
    return (
      <TokenValueAndAmount
        token={tokenBalance}
        className={className}
        valueClassName='text-sm md:text-base'
        amountClassName='text-xs md:text-sm'
      />
    )
  }

  return <>-</>
}
