import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { NETWORK, RNG_AUCTION_ADDRESS } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { formatUnits } from 'viem'
import { usePublicClient } from 'wagmi'
import { RNG_QUERY_START_BLOCK } from '@constants/config'

export const useDrawRngTx = (prizePool: PrizePool, drawId: number) => {
  const publicClient = usePublicClient({ chainId: NETWORK.mainnet })

  const { data: rngTxs, isFetched: isFetchedRngTxs } = useQuery(
    ['drawRngTxs'],
    async () => {
      const logs = await publicClient.getLogs({
        address: RNG_AUCTION_ADDRESS,
        event: {
          inputs: [
            { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
            { indexed: true, internalType: 'address', name: 'recipient', type: 'address' },
            { indexed: true, internalType: 'uint32', name: 'sequenceId', type: 'uint32' },
            { indexed: false, internalType: 'contract RNGInterface', name: 'rng', type: 'address' },
            { indexed: false, internalType: 'uint32', name: 'rngRequestId', type: 'uint32' },
            { indexed: false, internalType: 'uint64', name: 'elapsedTime', type: 'uint64' },
            { indexed: false, internalType: 'UD2x18', name: 'rewardFraction', type: 'uint64' }
          ],
          name: 'RngAuctionCompleted',
          type: 'event'
        },
        fromBlock: RNG_QUERY_START_BLOCK,
        toBlock: 'latest',
        strict: true
      })

      return logs.map((log) => ({
        feePercentage: parseFloat(formatUnits(log.args.rewardFraction, 18)) * 100,
        feeRecipient: log.args.recipient,
        hash: log.transactionHash,
        block: Number(log.blockNumber)
      }))
    },
    {
      enabled: !!prizePool && !!publicClient,
      ...NO_REFETCH
    }
  )

  // TODO: get proper tx that matches period of drawId (different prize pools have different draw IDs)
  const data = rngTxs?.[drawId - 1]

  const isFetched = isFetchedRngTxs

  return { data, isFetched }
}
