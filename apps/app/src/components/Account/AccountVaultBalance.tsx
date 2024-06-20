import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useUserVaultShareBalance,
  useUserVaultTokenBalance
} from '@generationsoftware/hyperstructure-react-hooks'
import { TokenAmount, TokenValueAndAmount } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import classNames from 'classnames'
import { Address, formatUnits } from 'viem'
import { useAccount } from 'wagmi'

interface AccountVaultBalanceProps {
  vault: Vault
  address?: Address
  className?: string
  valueClassName?: string
  amountClassName?: string
}

export const AccountVaultBalance = (props: AccountVaultBalanceProps) => {
  const { vault, address, className, valueClassName, amountClassName } = props

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  const { data: tokenBalance, isFetched: isFetchedTokenBalance } = useUserVaultTokenBalance(
    vault,
    userAddress as Address
  )

  const { data: shareBalance } = useUserVaultShareBalance(vault, userAddress as Address)

  if (!userAddress) {
    return <>-</>
  }

  if (!isFetchedTokenBalance) {
    return <Spinner />
  }

  if (tokenBalance === undefined) {
    if (!!shareBalance && shareBalance.amount > 0n) {
      return (
        <span
          className={classNames(
            'text-xs text-pt-purple-200 md:text-sm',
            className,
            amountClassName
          )}
        >
          <TokenAmount token={shareBalance} hideZeroes={true} />
        </span>
      )
    } else {
      return <>?</>
    }
  }

  if (tokenBalance.amount > 0n) {
    const shiftedAmount = parseFloat(formatUnits(tokenBalance.amount, tokenBalance.decimals))

    return (
      <TokenValueAndAmount
        token={tokenBalance}
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
