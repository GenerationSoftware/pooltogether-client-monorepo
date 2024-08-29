import { useIsTestnets } from '@shared/generic-react-hooks'
import { NETWORK, PRIZE_POOLS } from '@shared/utilities'
import defaultVaultList from '@vaultLists/default'
import { SUPPORTED_NETWORKS } from '@constants/config'

/**
 * Returns currently selected SUPPORTED_NETWORKS
 * @returns
 */
export const useNetworks = (): NETWORK[] => {
  const { isTestnets } = useIsTestnets()

  const networksWithPrizePools = PRIZE_POOLS.map((pool) => pool.chainId)
  const networksWithVaults = defaultVaultList.tokens.map((vault) => vault.chainId)

  const isValidNetwork = (network: NETWORK) =>
    networksWithPrizePools.includes(network) && networksWithVaults.includes(network)

  if (isTestnets) {
    return SUPPORTED_NETWORKS.testnets.filter(isValidNetwork)
  }

  return SUPPORTED_NETWORKS.mainnets.filter(isValidNetwork)
}
