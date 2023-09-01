import { usePrizePools } from '@generationsoftware/hyperstructure-react-hooks'
import { PRIZE_POOLS } from '@shared/utilities'
import { useNetworks } from './useNetworks'

/**
 * Returns a keyed object of prize pool IDs and PrizePool instances for supported chains
 * @returns
 */
export const useSupportedPrizePools = () => {
  const networks = useNetworks()

  const supportedPrizePoolInfo = PRIZE_POOLS.filter((poolInfo) =>
    networks.includes(poolInfo.chainId)
  )

  return usePrizePools(supportedPrizePoolInfo)
}
