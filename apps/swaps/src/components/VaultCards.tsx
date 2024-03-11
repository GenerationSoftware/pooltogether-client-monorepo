import {
  usePrizePool,
  usePrizeTokenData,
  useVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import { PRIZE_POOLS } from '@shared/utilities'
import classNames from 'classnames'
import { VAULT_ADDRESSES } from '@constants/config'
import { VaultCard } from './VaultCard'

interface VaultCardsProps {
  chainId: keyof typeof VAULT_ADDRESSES
  className?: string
}

export const VaultCards = (props: VaultCardsProps) => {
  const { chainId, className } = props

  const vaultInfoArray = VAULT_ADDRESSES[chainId].map((address) => ({ chainId, address }))
  const vaults = useVaults(vaultInfoArray, { useAllChains: true })

  const prizePoolInfo = PRIZE_POOLS.find(
    (pool) => pool.chainId === chainId
  ) as (typeof PRIZE_POOLS)[number]
  const prizePool = usePrizePool(chainId, prizePoolInfo.address, prizePoolInfo.options)
  const { data: prizeToken } = usePrizeTokenData(prizePool)

  return (
    <div className={classNames('w-full flex flex-wrap gap-6 justify-center', className)}>
      {!!prizeToken ? (
        Object.values(vaults.vaults).map((vault) => (
          <VaultCard key={`vaultCard-${vault.id}`} vault={vault} prizeToken={prizeToken} />
        ))
      ) : (
        <Spinner />
      )}
    </div>
  )
}
