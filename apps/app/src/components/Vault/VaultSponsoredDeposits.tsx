import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useVaultBalance,
  useVaultShareData,
  useVaultTotalDelegateSupply
} from '@generationsoftware/hyperstructure-react-hooks'
import { TokenAmount, TokenValueAndAmount } from '@shared/react-components'
import { Spinner } from '@shared/ui'
import { formatNumberForDisplay } from '@shared/utilities'
import classNames from 'classnames'
import { formatUnits } from 'viem'

interface VaultSponsoredDepositsProps {
  vault: Vault
  onlyShowMultiplier?: boolean
  className?: string
  valueClassName?: string
  amountClassName?: string
}

export const VaultSponsoredDeposits = (props: VaultSponsoredDepositsProps) => {
  const { vault, onlyShowMultiplier, className, valueClassName, amountClassName } = props

  const { data: shareData } = useVaultShareData(vault)

  const { data: totalDeposits, isFetched: isFetchedTotalDeposits } = useVaultBalance(vault)

  const { data: totalDelegateSupply, isFetched: isFetchedTotalDelegateSupply } =
    useVaultTotalDelegateSupply(vault)

  if (!isFetchedTotalDeposits || !isFetchedTotalDelegateSupply) {
    return <Spinner />
  }

  if (totalDeposits === undefined || totalDelegateSupply === undefined) {
    return <>?</>
  }

  if (totalDeposits.amount === 0n && !!shareData && shareData.totalSupply > 0n) {
    const sponsoredAmount = shareData.totalSupply - totalDelegateSupply

    if (onlyShowMultiplier) {
      const shiftedTotalAmount = parseFloat(formatUnits(shareData.totalSupply, shareData.decimals))
      const shiftedSponsoredAmount = parseFloat(formatUnits(sponsoredAmount, shareData.decimals))

      return (
        <>{`${formatNumberForDisplay(
          shiftedTotalAmount / (shiftedTotalAmount - shiftedSponsoredAmount),
          { maximumFractionDigits: 2 }
        )}x`}</>
      )
    } else {
      return (
        <span className={classNames('text-xs md:text-sm', className, amountClassName)}>
          <TokenAmount token={{ ...shareData, amount: sponsoredAmount }} hideZeroes={true} />
        </span>
      )
    }
  }

  const sponsoredAmount = totalDeposits.amount - totalDelegateSupply
  const shiftedSponsoredAmount = parseFloat(formatUnits(sponsoredAmount, totalDeposits.decimals))

  if (onlyShowMultiplier) {
    const shiftedTotalAmount = parseFloat(formatUnits(totalDeposits.amount, totalDeposits.decimals))

    return (
      <>{`${formatNumberForDisplay(
        shiftedTotalAmount / (shiftedTotalAmount - shiftedSponsoredAmount),
        { maximumFractionDigits: 2 }
      )}x`}</>
    )
  }

  return (
    <TokenValueAndAmount
      token={{ ...totalDeposits, amount: sponsoredAmount }}
      className={className}
      valueClassName={classNames('text-sm md:text-base', valueClassName)}
      amountClassName={classNames('text-xs md:text-sm', amountClassName)}
      valueOptions={{ hideZeroes: true, shortenMillions: true }}
      amountOptions={
        shiftedSponsoredAmount > 1e3 ? { hideZeroes: true } : { maximumFractionDigits: 2 }
      }
    />
  )
}
