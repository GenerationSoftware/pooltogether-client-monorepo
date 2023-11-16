import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import { useVaultPromotionsApr } from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import { formatNumberForDisplay, TWAB_REWARDS_ADDRESSES } from '@shared/utilities'
import classNames from 'classnames'
import { TWAB_REWARDS_SETTINGS } from '@constants/config'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'

interface VaultBonusRewardsProps {
  vault: Vault
  label?: string
  className?: string
  valueClassName?: string
  labelClassName?: string
}

export const VaultBonusRewards = (props: VaultBonusRewardsProps) => {
  const { vault, label, className, valueClassName, labelClassName } = props

  const prizePools = useSupportedPrizePools()

  const prizePool =
    !!vault && Object.values(prizePools).find((prizePool) => prizePool.chainId === vault.chainId)

  const tokenAddresses = !!vault ? TWAB_REWARDS_SETTINGS[vault.chainId].tokenAddresses : []
  const fromBlock = !!vault ? TWAB_REWARDS_SETTINGS[vault.chainId].fromBlock : undefined
  const { data: vaultPromotionsApr, isFetched: isFetchedVaultPromotionsApr } =
    useVaultPromotionsApr(vault, prizePool as PrizePool, tokenAddresses, { fromBlock })

  if (!!vault && TWAB_REWARDS_ADDRESSES[vault.chainId] === undefined) {
    return <>-</>
  }

  if (!isFetchedVaultPromotionsApr) {
    return <Spinner />
  }

  if (vaultPromotionsApr === undefined) {
    return <>?</>
  }

  return (
    <div className={classNames('inline-flex gap-1 items-center', className)}>
      <span className={valueClassName}>
        {formatNumberForDisplay(vaultPromotionsApr, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1
        })}
        %
      </span>
      <span className={labelClassName}>{label}</span>
    </div>
  )
}
