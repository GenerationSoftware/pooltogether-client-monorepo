import { sToMs } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'

interface DecentRequest {
  actionType: 'swap-action'
  sender: Address
  srcChainId: number
  srcToken: Address
  dstChainId: number
  dstToken: Address
  slippage: number
  actionConfig: {
    chainId: number
    amount: bigint
    swapDirection: 'exact-amount-in'
    receiverAddress: Address
  }
}

interface DecentResponse {
  tx: { chainId: number; to: Address; data: `0x${string}`; value: bigint }
  tokenPayment: DecentToken
  amountOut: DecentToken
}

interface DecentToken {
  chainId: number
  tokenAddress: Address
  decimals: number
  name: string
  symbol: string
  amount: bigint
  isNative: boolean
}

export const useSwapTx = (swapData: {
  chainId: number
  from: { address: Address; amount: bigint }
  to: { address: Address }
  sender: Address
  receiver: Address
  options?: { slippage?: number }
}) => {
  const { chainId, from, to, sender, receiver, options } = swapData ?? {}

  const publicClient = usePublicClient({ chainId })

  const enabled =
    !!chainId &&
    !!from?.address &&
    !!from?.amount &&
    !!to?.address &&
    !!sender &&
    !!receiver &&
    !!publicClient &&
    !!process.env.NEXT_PUBLIC_DECENT_API_KEY

  const queryKey = [
    'swapTx',
    chainId,
    from?.address,
    from?.amount.toString(),
    to?.address,
    sender,
    receiver,
    options?.slippage
  ]

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!!publicClient) {
        const txConfig: DecentRequest = {
          actionType: 'swap-action',
          sender,
          srcChainId: chainId,
          srcToken: from.address,
          dstChainId: chainId,
          dstToken: to.address,
          slippage: options?.slippage ?? 1,
          actionConfig: {
            chainId,
            amount: from.amount,
            swapDirection: 'exact-amount-in',
            receiverAddress: receiver
          }
        }

        const apiUrl = new URL('https://box-v2.api.decent.xyz/api/getBoxAction')
        apiUrl.searchParams.set('arguments', JSON.stringify(txConfig, bigintSerializer))

        const rawApiResponse = await fetch(apiUrl.toString(), {
          method: 'get',
          headers: { 'x-api-key': process.env.NEXT_PUBLIC_DECENT_API_KEY as string }
        }).then((r) => r.text())
        const apiResponse: DecentResponse = JSON.parse(rawApiResponse, bigintDeserializer)

        return apiResponse.tx
      }
    },
    enabled,
    staleTime: sToMs(60)
  })
}

const bigintSerializer = (_key: string, value: unknown): unknown => {
  if (typeof value === 'bigint') return value.toString() + 'n'
  return value
}

const bigintDeserializer = (_key: string, value: unknown): unknown => {
  if (typeof value === 'string' && /^-?\d+n$/.test(value)) return BigInt(value.slice(0, -1))
  return value
}
