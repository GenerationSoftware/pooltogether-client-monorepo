import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useVaultBalance, useVaultShareData } from '@generationsoftware/hyperstructure-react-hooks'
import { TokenAmount, TokenValueAndAmount } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import classNames from 'classnames'
import { formatUnits } from 'viem'

interface VaultTotalDepositsProps {
  vault: Vault
  className?: string
  valueClassName?: string
  amountClassName?: string
}

export const VaultTotalDeposits = (props: VaultTotalDepositsProps) => {
  const { vault, className, valueClassName, amountClassName } = props

  const { data: shareData } = useVaultShareData(vault)

  const { data: totalDeposits, isFetched: isFetchedTotalDeposits } = useVaultBalance(vault)

  if (!isFetchedTotalDeposits) {
    return <Spinner />
  }

  if (totalDeposits === undefined) {
    return <>?</>
  }

  if (totalDeposits.amount === 0n && !!shareData && shareData.totalSupply > 0n) {
    return (
      <span className={classNames('text-xs md:text-sm', className, amountClassName)}>
        <TokenAmount token={{ ...shareData, amount: shareData.totalSupply }} hideZeroes={true} />
      </span>
    )
  }

  const shiftedAmount = parseFloat(formatUnits(totalDeposits.amount, totalDeposits.decimals))

  return (
    <TokenValueAndAmount
      token={totalDeposits}
      className={className}
      valueClassName={classNames('text-sm md:text-base', valueClassName)}
      amountClassName={classNames('text-xs md:text-sm', amountClassName)}
      valueOptions={{ hideZeroes: true, shortenMillions: true }}
      amountOptions={shiftedAmount > 1e3 ? { hideZeroes: true } : { maximumFractionDigits: 2 }}
    />
  )
}
