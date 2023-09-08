import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useUserVaultDelegationBalance,
  useUserVaultShareBalance,
  useVaultExchangeRate,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { TokenValueAndAmount } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import { getAssetsFromShares } from '@shared/utilities'
import { Address } from 'viem'
import { useAccount } from 'wagmi'

interface AccountVaultDelegationAmountProps {
  vault: Vault
  address?: Address
  className?: string
}

export const AccountVaultDelegationAmount = (props: AccountVaultDelegationAmountProps) => {
  const { vault, address, className } = props

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  const { data: shareBalance, isFetched: isFetchedShareBalance } = useUserVaultShareBalance(
    vault,
    userAddress as Address
  )
  const { data: _delegationBalance, isFetched: isFetchedDelegationBalance } =
    useUserVaultDelegationBalance(vault, userAddress as Address)
  const delegationBalance =
    !!_delegationBalance && !!shareBalance ? _delegationBalance - shareBalance.amount : 0n

  const { data: exchangeRate, isFetched: isFetchedExchangeRate } = useVaultExchangeRate(vault)

  const { data: tokenData, isFetched: isFetchedTokenData } = useVaultTokenData(vault)

  if (!userAddress) {
    return <>-</>
  }

  if (!isFetchedDelegationBalance || !isFetchedExchangeRate || !isFetchedTokenData) {
    return <Spinner />
  }

  if (!isFetchedShareBalance || !exchangeRate || !tokenData) {
    return <>?</>
  }

  if (delegationBalance > 0n) {
    return (
      <TokenValueAndAmount
        token={{
          ...tokenData,
          amount: getAssetsFromShares(delegationBalance, exchangeRate, tokenData.decimals)
        }}
        className={className}
        valueClassName='text-sm md:text-base'
        amountClassName='text-xs md:text-sm'
        valueOptions={{ hideZeroes: true }}
      />
    )
  }

  return <>-</>
}
