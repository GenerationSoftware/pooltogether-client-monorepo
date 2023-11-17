import { Vault } from '@generationsoftware/hyperstructure-client-js'
import { useSortedVaults } from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import classNames from 'classnames'
import { TWAB_REWARDS_SETTINGS } from '@constants/config'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'
import { VaultCard } from './VaultCard'

interface VaultsCardsProps {
  chainId: number
  vaults: Vault[]
  className?: string
}

export const VaultCards = (props: VaultsCardsProps) => {
  const { chainId, vaults, className } = props

  const prizePools = useSupportedPrizePools()
  const prizePool = Object.values(prizePools).find((prizePool) => prizePool.chainId === chainId)

  const twabRewards = TWAB_REWARDS_SETTINGS[chainId]
    ? {
        rewardTokenAddresses: TWAB_REWARDS_SETTINGS[chainId].tokenAddresses,
        fromBlock: TWAB_REWARDS_SETTINGS[chainId].fromBlock
      }
    : undefined
  const { sortedVaults, isFetched } = useSortedVaults(vaults, { prizePool, twabRewards })

  if (!isFetched) {
    return <Spinner className={className} />
  }

  return (
    <div className={classNames('w-full max-w-[36rem] flex flex-col gap-4', className)}>
      {sortedVaults.map((vault) => (
        <VaultCard key={vault.id} vault={vault} />
      ))}
    </div>
  )
}
