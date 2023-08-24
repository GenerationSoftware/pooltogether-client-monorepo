import { Vault } from '@pooltogether/hyperstructure-client-js'
import {
  useAllUserBalanceUpdates,
  useVaultExchangeRate,
  useVaultTokenData
} from '@pooltogether/hyperstructure-react-hooks'
import { TokenValueAndAmount } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import { getAssetsFromShares } from '@shared/utilities'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'

interface AccountVaultDelegationAmountProps {
  vault: Vault
  address?: Address
  className?: string
}

export const AccountVaultDelegationAmount = (props: AccountVaultDelegationAmountProps) => {
  const { vault, address, className } = props

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  const prizePools = useSupportedPrizePools()
  const prizePoolsArray = Object.values(prizePools)

  const { data: balanceUpdates, isFetched: isFetchedBalanceUpdates } = useAllUserBalanceUpdates(
    prizePoolsArray,
    userAddress as Address
  )

  const { data: exchangeRate, isFetched: isFetchedExchangeRate } = useVaultExchangeRate(vault)

  const { data: tokenData, isFetched: isFetchedTokenData } = useVaultTokenData(vault)

  if (!userAddress) {
    return <>-</>
  }

  if (!isFetchedBalanceUpdates || !isFetchedExchangeRate || !isFetchedTokenData) {
    return <Spinner />
  }

  if (!balanceUpdates || !exchangeRate || !tokenData) {
    return <>?</>
  }

  const latestObservation =
    balanceUpdates[vault.chainId]?.[vault.address.toLowerCase() as Address]?.[0]
  const delegatedAmount = !!latestObservation
    ? latestObservation.delegateBalance - latestObservation.balance
    : 0n

  if (delegatedAmount > 0n) {
    return (
      <TokenValueAndAmount
        token={{
          ...tokenData,
          amount: getAssetsFromShares(delegatedAmount, exchangeRate, tokenData.decimals)
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
