import { NO_REFETCH } from '@shared/generic-react-hooks'
import { getBlockAtTimestamp } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'

export const useBlockAtTimestamp = (chainId: number, timestamp: number) => {
  const publicClient = usePublicClient({ chainId })

  const queryKey = ['blockAtTimestamp', chainId, Math.floor(timestamp)]

  return useQuery(
    queryKey,
    async () => await getBlockAtTimestamp(publicClient, BigInt(Math.floor(timestamp))),
    {
      enabled: !!chainId && !!timestamp && !!publicClient,
      ...NO_REFETCH
    }
  )
}
