import { useIsTestnets } from '@shared/generic-react-hooks'
import { NETWORK, PRIZE_POOLS } from '@shared/utilities'
import { SUPPORTED_NETWORKS } from '@constants/config'

/**
 * Returns currently selected SUPPORTED_NETWORKS
 * @returns
 */
export const useNetworks = (): NETWORK[] => {
  const { isTestnets } = useIsTestnets()

  const networksWithPrizePools = PRIZE_POOLS.map((pool) => pool.chainId)

  if (isTestnets) {
    return SUPPORTED_NETWORKS.testnets.filter((network) => networksWithPrizePools.includes(network))
  }

  return SUPPORTED_NETWORKS.mainnets.filter((network) => networksWithPrizePools.includes(network))
}
