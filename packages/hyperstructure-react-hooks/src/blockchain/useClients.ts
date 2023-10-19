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
      usePublicClient({ chainId: NETWORK.arbitrum })
    ],
    testnets: [usePublicClient({ chainId: NETWORK['optimism-goerli'] })]
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
      [NETWORK.arbitrum]: usePublicClient({ chainId: NETWORK.arbitrum })
    },
    testnets: {
      [NETWORK['optimism-goerli']]: usePublicClient({ chainId: NETWORK['optimism-goerli'] })
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
