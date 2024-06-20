import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useVaultPromotionsApr } from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import { formatNumberForDisplay, TWAB_REWARDS_ADDRESSES } from '@shared/utilities'
import classNames from 'classnames'
import { ReactNode } from 'react'
import { TWAB_REWARDS_SETTINGS } from '@constants/config'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'

interface VaultBonusRewardsProps {
  vault: Vault
  prepend?: ReactNode
  append?: ReactNode
  hideUnlessPresent?: boolean
  className?: string
  valueClassName?: string
}

// TODO: enable also showing tokens that rewards are in ("in OP + 2 other tokens", etc.)
export const VaultBonusRewards = (props: VaultBonusRewardsProps) => {
  const { vault, prepend, append, hideUnlessPresent, className, valueClassName } = props

  const prizePoolsArray = Object.values(useSupportedPrizePools())
  const prizePool = prizePoolsArray.find((prizePool) => prizePool.chainId === vault?.chainId)

  const tokenAddresses = !!vault ? TWAB_REWARDS_SETTINGS[vault.chainId].tokenAddresses : []
  const fromBlock = !!vault ? TWAB_REWARDS_SETTINGS[vault.chainId].fromBlock : undefined

  const { data: vaultPromotionsApr, isFetched: isFetchedVaultPromotionsApr } =
    useVaultPromotionsApr(vault, prizePool!, tokenAddresses, { fromBlock })

  if (
    (!!vault && TWAB_REWARDS_ADDRESSES[vault.chainId] === undefined) ||
    vaultPromotionsApr === 0
  ) {
    return hideUnlessPresent ? <></> : <>-</>
  }

  if (!isFetchedVaultPromotionsApr) {
    return hideUnlessPresent ? <></> : <Spinner />
  }

  if (vaultPromotionsApr === undefined) {
    return hideUnlessPresent ? <></> : <>?</>
  }

  return (
    <div className={classNames('inline-flex gap-1 items-center', className)}>
      {prepend}
      <span className={valueClassName}>
        {formatNumberForDisplay(vaultPromotionsApr, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1
        })}
        %
      </span>
      {append}
    </div>
  )
}
