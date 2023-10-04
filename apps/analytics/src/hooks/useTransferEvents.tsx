import { NO_REFETCH } from '@shared/generic-react-hooks'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'

export const useTransferEvents = (
  chainId: number,
  tokenAddress: Address,
  options?: { from?: Address[]; to?: Address[]; fromBlock?: bigint; toBlock?: bigint }
) => {
  const publicClient = usePublicClient({ chainId })

  const queryKey = [
    'tokenTransfers',
    chainId,
    tokenAddress,
    options?.from,
    options?.to,
    options?.fromBlock?.toString(),
    options?.toBlock?.toString() ?? 'latest'
  ]

  return useQuery(
    queryKey,
    async () => {
      return await publicClient.getLogs({
        address: tokenAddress,
        event: {
          inputs: [
            { indexed: true, internalType: 'address', name: 'from', type: 'address' },
            { indexed: true, internalType: 'address', name: 'to', type: 'address' },
            { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' }
          ],
          name: 'Transfer',
          type: 'event'
        },
        args: {
          from: options?.from,
          to: options?.to
        },
        fromBlock: options?.fromBlock,
        toBlock: options?.toBlock ?? 'latest',
        strict: true
      })
    },
    {
      enabled: !!chainId && !!publicClient && !!tokenAddress,
      ...NO_REFETCH
    }
  )
}
