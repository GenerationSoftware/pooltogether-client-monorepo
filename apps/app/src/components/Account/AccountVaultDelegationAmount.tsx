import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useUserVaultDelegationBalance,
  useUserVaultShareBalance,
  useVaultExchangeRate,
  useVaultTokenData
} from '@generationsoftware/hyperstructure-react-hooks'
import { TokenAmount, TokenValueAndAmount } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import { getAssetsFromShares } from '@shared/utilities'
import classNames from 'classnames'
import { Address, formatUnits } from 'viem'
import { useAccount } from 'wagmi'

interface AccountVaultDelegationAmountProps {
  vault: Vault
  address?: Address
  className?: string
  valueClassName?: string
  amountClassName?: string
}

export const AccountVaultDelegationAmount = (props: AccountVaultDelegationAmountProps) => {
  const { vault, address, className, valueClassName, amountClassName } = props

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
    if (!!shareBalance && delegationBalance > 0n) {
      return (
        <span
          className={classNames(
            'text-xs text-pt-purple-200 md:text-sm',
            className,
            amountClassName
          )}
        >
          <TokenAmount token={{ ...shareBalance, amount: delegationBalance }} hideZeroes={true} />
        </span>
      )
    } else {
      return <>?</>
    }
  }

  if (delegationBalance > 0n) {
    const amount = getAssetsFromShares(delegationBalance, exchangeRate, tokenData.decimals)
    const shiftedAmount = parseFloat(formatUnits(amount, tokenData.decimals))

    return (
      <TokenValueAndAmount
        token={{ ...tokenData, amount }}
        className={className}
        valueClassName={classNames('text-sm md:text-base', valueClassName)}
        amountClassName={classNames('text-xs md:text-sm', amountClassName)}
        valueOptions={{ hideZeroes: true }}
        amountOptions={shiftedAmount > 1e3 ? { hideZeroes: true } : { maximumFractionDigits: 2 }}
      />
    )
  }

  return <>-</>
}
