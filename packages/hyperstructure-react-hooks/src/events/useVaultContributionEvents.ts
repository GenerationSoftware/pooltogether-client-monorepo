import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getVaultContributionEvents } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'
import { QUERY_KEYS } from '../constants'

/**
 * Returns `ContributePrizeTokens` events
 * @param prizePool the prize pool to query events for
 * @param options optional settings (recommended `vaultAddress` param)
 * @returns
 */
export const useVaultContributionEvents = (
  prizePool: PrizePool,
  options?: { vaultAddress?: Address; fromBlock?: bigint; toBlock?: bigint }
) => {
  const publicClient = usePublicClient({ chainId: prizePool?.chainId })

  const queryKey = [
    QUERY_KEYS.vaultContributionEvents,
    prizePool?.id,
    options?.vaultAddress,
    options?.fromBlock?.toString(),
    options?.toBlock?.toString() ?? 'latest'
  ]

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!!publicClient) {
        return await getVaultContributionEvents(publicClient, prizePool.address, options)
      }
    },
    enabled: !!prizePool && !!publicClient,
    ...NO_REFETCH
  })
}
