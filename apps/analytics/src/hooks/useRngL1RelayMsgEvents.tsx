import { NO_REFETCH } from '@shared/generic-react-hooks'
import { NETWORK, RNG_RELAY_ADDRESSES } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { QUERY_START_BLOCK } from '@constants/config'

export const useRngL1RelayMsgEvents = () => {
  const mainnetPublicClient = usePublicClient({ chainId: NETWORK.mainnet })

  return useQuery(
    ['rngL1RelayMsgEvents'],
    async () => {
      return await mainnetPublicClient.getLogs({
        address: RNG_RELAY_ADDRESSES[NETWORK.mainnet],
        event: {
          inputs: [
            {
              indexed: false,
              internalType: 'contract IMessageDispatcher',
              name: 'messageDispatcher',
              type: 'address'
            },
            { indexed: true, internalType: 'uint256', name: 'remoteOwnerChainId', type: 'uint256' },
            {
              indexed: false,
              internalType: 'contract RemoteOwner',
              name: 'remoteOwner',
              type: 'address'
            },
            {
              indexed: false,
              internalType: 'contract IRngAuctionRelayListener',
              name: 'remoteRngAuctionRelayListener',
              type: 'address'
            },
            { indexed: true, internalType: 'address', name: 'rewardRecipient', type: 'address' },
            { indexed: true, internalType: 'bytes32', name: 'messageId', type: 'bytes32' }
          ],
          name: 'RelayedToDispatcher',
          type: 'event'
        },
        fromBlock: QUERY_START_BLOCK[NETWORK.mainnet],
        toBlock: 'latest',
        strict: true
      })
    },
    {
      enabled: !!mainnetPublicClient,
      ...NO_REFETCH
    }
  )
}
