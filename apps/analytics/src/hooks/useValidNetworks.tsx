import { NETWORK, PRIZE_POOLS } from '@shared/utilities'
import { useMemo } from 'react'
import { SUPPORTED_NETWORKS } from '@constants/config'

export const useValidNetworks = () => {
  return useMemo(() => {
    const networks = new Set<NETWORK>()
    const allSupportedNetworks = [...SUPPORTED_NETWORKS.mainnets, ...SUPPORTED_NETWORKS.testnets]

    allSupportedNetworks.forEach((network) => {
      const prizePool = PRIZE_POOLS.find((prizePool) => prizePool.chainId === network)
      !!prizePool && networks.add(network)
    })

    return [...networks]
  }, [])
}
