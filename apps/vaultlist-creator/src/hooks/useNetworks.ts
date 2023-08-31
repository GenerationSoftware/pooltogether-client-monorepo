import { NETWORK } from '@shared/utilities'
import { SUPPORTED_NETWORKS } from '@constants/config'

/**
 * Returns all SUPPORTED_NETWORKS
 * @returns
 */
export const useNetworks = (): NETWORK[] => {
  return [...SUPPORTED_NETWORKS.mainnets, ...SUPPORTED_NETWORKS.testnets]
}
