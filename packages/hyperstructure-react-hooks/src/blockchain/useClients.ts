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
      usePublicClient({ chainId: NETWORK.arbitrum })
    ],
    testnets: [
      usePublicClient({ chainId: NETWORK.optimism_sepolia }),
      usePublicClient({ chainId: NETWORK.arbitrum_sepolia })
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
      [NETWORK.arbitrum]: usePublicClient({ chainId: NETWORK.arbitrum })
    },
    testnets: {
      [NETWORK.optimism_sepolia]: usePublicClient({ chainId: NETWORK.optimism_sepolia }),
      [NETWORK.arbitrum_sepolia]: usePublicClient({ chainId: NETWORK.arbitrum_sepolia })
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
