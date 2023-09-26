import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { QUERY_START_BLOCK } from '@constants/config'

export const useDrawClosedEvents = (prizePool: PrizePool) => {
  const publicClient = usePublicClient({ chainId: prizePool?.chainId })

  const queryKey = ['drawClosedEvents', prizePool?.chainId]

  return useQuery(
    queryKey,
    async () => {
      return await publicClient.getLogs({
        address: prizePool.address,
        event: {
          inputs: [
            { indexed: true, internalType: 'uint24', name: 'drawId', type: 'uint24' },
            {
              indexed: false,
              internalType: 'uint256',
              name: 'winningRandomNumber',
              type: 'uint256'
            },
            { indexed: false, internalType: 'uint8', name: 'numTiers', type: 'uint8' },
            { indexed: false, internalType: 'uint8', name: 'nextNumTiers', type: 'uint8' },
            { indexed: false, internalType: 'uint104', name: 'reserve', type: 'uint104' },
            {
              indexed: false,
              internalType: 'UD34x4',
              name: 'prizeTokensPerShare',
              type: 'uint128'
            },
            { indexed: false, internalType: 'uint64', name: 'drawStartedAt', type: 'uint64' }
          ],
          name: 'DrawClosed',
          type: 'event'
        },
        fromBlock: QUERY_START_BLOCK[prizePool.chainId],
        toBlock: 'latest',
        strict: true
      })
    },
    {
      enabled: !!prizePool && !!publicClient,
      ...NO_REFETCH
    }
  )
}
