import { useIsTestnets } from '@shared/generic-react-hooks'
import { NETWORK } from '@shared/utilities'
import { PublicClient } from 'viem'
import { usePublicClient } from 'wagmi'

/**
 * Returns Viem clients
 * @param options optional settings
 * @returns
 */
export const usePublicClients = (options?: { useAll?: boolean }): PublicClient[] => {
  const { isTestnets } = useIsTestnets()

  const publicClients: { mainnets: PublicClient[]; testnets: PublicClient[] } = {
    mainnets: [
      usePublicClient({ chainId: NETWORK.mainnet }),
      usePublicClient({ chainId: NETWORK.optimism }),
      usePublicClient({ chainId: NETWORK.arbitrum }),
      usePublicClient({ chainId: NETWORK.polygon }),
      usePublicClient({ chainId: NETWORK.avalanche }),
      usePublicClient({ chainId: NETWORK.celo })
    ],
    testnets: [
      usePublicClient({ chainId: NETWORK.optimism_sepolia }),
      usePublicClient({ chainId: NETWORK.arbitrum_sepolia })
    ]
  }

  if (options?.useAll) {
    return [...publicClients.mainnets, ...publicClients.testnets]
  }

  if (isTestnets) {
    return publicClients.testnets
  }

  return publicClients.mainnets
}

/**
 * Returns Viem clients keyed by chain
 * @param options optional settings
 * @returns
 */
export const usePublicClientsByChain = (options?: {
  useAll?: boolean
}): Record<number, PublicClient> => {
  const { isTestnets } = useIsTestnets()

  const publicClients: {
    mainnets: { [chainId: number]: PublicClient }
    testnets: { [chainId: number]: PublicClient }
  } = {
    mainnets: {
      [NETWORK.mainnet]: usePublicClient({ chainId: NETWORK.mainnet }),
      [NETWORK.optimism]: usePublicClient({ chainId: NETWORK.optimism }),
      [NETWORK.arbitrum]: usePublicClient({ chainId: NETWORK.arbitrum }),
      [NETWORK.polygon]: usePublicClient({ chainId: NETWORK.polygon }),
      [NETWORK.avalanche]: usePublicClient({ chainId: NETWORK.avalanche }),
      [NETWORK.celo]: usePublicClient({ chainId: NETWORK.celo })
    },
    testnets: {
      [NETWORK.optimism_sepolia]: usePublicClient({ chainId: NETWORK.optimism_sepolia }),
      [NETWORK.arbitrum_sepolia]: usePublicClient({ chainId: NETWORK.arbitrum_sepolia })
    }
  }

  if (options?.useAll) {
    return { ...publicClients.mainnets, ...publicClients.testnets }
  }

  if (isTestnets) {
    return publicClients.testnets
  }

  return publicClients.mainnets
}
