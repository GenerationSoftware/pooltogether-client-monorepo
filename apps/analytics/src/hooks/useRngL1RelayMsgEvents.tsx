import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { NETWORK, RNG_RELAY_ADDRESSES } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'
import { QUERY_START_BLOCK, RELAY_ORIGINS } from '@constants/config'

export const useRngL1RelayMsgEvents = (prizePool: PrizePool) => {
  const originChainId = !!prizePool ? RELAY_ORIGINS[prizePool.chainId] : undefined
  const publicClient = usePublicClient({ chainId: originChainId })

  return useQuery(
    ['rngL1RelayMsgEvents'],
    async () => {
      // TODO: clean this up once not on testnet anymore
      const oldL1RelayEvents =
        originChainId === NETWORK.goerli
          ? await publicClient.getLogs({
              address: '0x926bb4699808f611B2c7cd57193A9b11f757B411',
              event: {
                inputs: [
                  {
                    indexed: false,
                    internalType: 'contract IMessageDispatcher',
                    name: 'messageDispatcher',
                    type: 'address'
                  },
                  {
                    indexed: true,
                    internalType: 'uint256',
                    name: 'remoteOwnerChainId',
                    type: 'uint256'
                  },
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
                  {
                    indexed: true,
                    internalType: 'address',
                    name: 'rewardRecipient',
                    type: 'address'
                  },
                  { indexed: true, internalType: 'bytes32', name: 'messageId', type: 'bytes32' }
                ],
                name: 'RelayedToDispatcher',
                type: 'event'
              },
              fromBlock: 9829000n,
              toBlock: 9846000n,
              strict: true
            })
          : []

      const l1RelayEvents = await publicClient.getLogs({
        address: RNG_RELAY_ADDRESSES[originChainId as number],
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
        fromBlock: QUERY_START_BLOCK[originChainId as number],
        toBlock: 'latest',
        strict: true
      })

      return oldL1RelayEvents.concat(l1RelayEvents)
    },
    {
      enabled: !!originChainId && !!publicClient,
      ...NO_REFETCH
    }
  )
}
