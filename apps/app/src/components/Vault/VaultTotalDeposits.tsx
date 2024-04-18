import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useVaultBalance, useVaultShareData } from '@generationsoftware/hyperstructure-react-hooks'
import { TokenAmount, TokenValueAndAmount } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import { formatUnits } from 'viem'

interface VaultTotalDepositsProps {
  vault: Vault
  className?: string
}

export const VaultTotalDeposits = (props: VaultTotalDepositsProps) => {
  const { vault, className } = props

  const { data: shareData } = useVaultShareData(vault)

  const { data: totalDeposits, isFetched: isFetchedTotalDeposits } = useVaultBalance(vault)

  if (!isFetchedTotalDeposits) {
    return <Spinner />
  }

  if (totalDeposits === undefined) {
    return <>?</>
  }

  if (totalDeposits.amount === 0n && !!shareData && shareData.totalSupply > 0n) {
    return <TokenAmount token={{ ...shareData, amount: shareData.totalSupply }} hideZeroes={true} />
  }

  const shiftedAmount = parseFloat(formatUnits(totalDeposits.amount, totalDeposits.decimals))

  return (
    <TokenValueAndAmount
      token={totalDeposits}
      className={className}
      valueClassName='text-sm md:text-base'
      amountClassName='text-xs md:text-sm'
      valueOptions={{ hideZeroes: true, shortenMillions: true }}
      amountOptions={shiftedAmount > 1e3 ? { hideZeroes: true } : { maximumFractionDigits: 2 }}
    />
  )
}
