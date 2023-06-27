import { NETWORK } from '@pooltogether/hyperstructure-client-js'
import { useIsTestnets } from '@shared/generic-react-hooks'
import { SUPPORTED_NETWORKS } from '@constants/config'

/**
 * Returns currently selected SUPPORTED_NETWORKS
 * @returns
 */
export const useNetworks = (): NETWORK[] => {
  const { isTestnets } = useIsTestnets()

  if (isTestnets) {
    return SUPPORTED_NETWORKS.testnets
  }

  return SUPPORTED_NETWORKS.mainnets
}
