import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import { useVaultPrizeYield } from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import { formatNumberForDisplay } from '@shared/utilities'
import classNames from 'classnames'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'

interface VaultPrizeYieldProps {
  vault: Vault
  label?: string
  className?: string
  valueClassName?: string
  labelClassName?: string
}

export const VaultPrizeYield = (props: VaultPrizeYieldProps) => {
  const { vault, label, className, valueClassName, labelClassName } = props

  const prizePools = useSupportedPrizePools()

  const prizePool =
    !!vault && Object.values(prizePools).find((prizePool) => prizePool.chainId === vault.chainId)

  const { data: prizeYield, isFetched: isFetchedPrizeYield } = useVaultPrizeYield(
    vault,
    prizePool as PrizePool
  )

  if (!isFetchedPrizeYield) {
    return <Spinner />
  }

  if (prizeYield === undefined) {
    return <>?</>
  }

  return (
    <div className={classNames('inline-flex gap-1 items-center', className)}>
      <span className={valueClassName}>
        {formatNumberForDisplay(prizeYield, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
        %
      </span>
      <span className={labelClassName}>{label}</span>
    </div>
  )
}
