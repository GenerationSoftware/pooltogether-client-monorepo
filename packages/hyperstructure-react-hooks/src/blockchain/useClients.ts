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

  const publicClients: {
    mainnets: (PublicClient | undefined)[]
    testnets: (PublicClient | undefined)[]
  } = {
    mainnets: [
      usePublicClient({ chainId: NETWORK.mainnet }),
      usePublicClient({ chainId: NETWORK.optimism }),
      usePublicClient({ chainId: NETWORK.arbitrum }),
      usePublicClient({ chainId: NETWORK.base }),
      usePublicClient({ chainId: NETWORK.polygon }),
      usePublicClient({ chainId: NETWORK.avalanche }),
      usePublicClient({ chainId: NETWORK.celo })
    ],
    testnets: [
      usePublicClient({ chainId: NETWORK.sepolia }),
      usePublicClient({ chainId: NETWORK.optimism_sepolia }),
      usePublicClient({ chainId: NETWORK.arbitrum_sepolia }),
      usePublicClient({ chainId: NETWORK.base_sepolia })
    ]
  }

  const filterClients = (clients: (PublicClient | undefined)[]) => {
    return clients.filter((client): client is PublicClient => !!client)
  }

  if (options?.useAll) {
    return filterClients([...publicClients.mainnets, ...publicClients.testnets])
  }

  if (isTestnets) {
    return filterClients(publicClients.testnets)
  }

  return filterClients(publicClients.mainnets)
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
    mainnets: { [chainId: number]: PublicClient | undefined }
    testnets: { [chainId: number]: PublicClient | undefined }
  } = {
    mainnets: {
      [NETWORK.mainnet]: usePublicClient({ chainId: NETWORK.mainnet }),
      [NETWORK.optimism]: usePublicClient({ chainId: NETWORK.optimism }),
      [NETWORK.arbitrum]: usePublicClient({ chainId: NETWORK.arbitrum }),
      [NETWORK.base]: usePublicClient({ chainId: NETWORK.base }),
      [NETWORK.polygon]: usePublicClient({ chainId: NETWORK.polygon }),
      [NETWORK.avalanche]: usePublicClient({ chainId: NETWORK.avalanche }),
      [NETWORK.celo]: usePublicClient({ chainId: NETWORK.celo })
    },
    testnets: {
      [NETWORK.sepolia]: usePublicClient({ chainId: NETWORK.sepolia }),
      [NETWORK.optimism_sepolia]: usePublicClient({ chainId: NETWORK.optimism_sepolia }),
      [NETWORK.arbitrum_sepolia]: usePublicClient({ chainId: NETWORK.arbitrum_sepolia }),
      [NETWORK.base_sepolia]: usePublicClient({ chainId: NETWORK.base_sepolia })
    }
  }

  const filterClients = (clients: { [chainId: number]: PublicClient | undefined }) => {
    const filteredClients: { [chainId: number]: PublicClient } = {}

    Object.entries(clients).forEach(([strChainId, client]) => {
      const isClient = (item: PublicClient | undefined): item is PublicClient => !!item

      if (isClient(client)) {
        filteredClients[parseInt(strChainId)] = client
      }
    })

    return filteredClients
  }

  if (options?.useAll) {
    return filterClients({ ...publicClients.mainnets, ...publicClients.testnets })
  }

  if (isTestnets) {
    return filterClients(publicClients.testnets)
  }

  return filterClients(publicClients.mainnets)
}
