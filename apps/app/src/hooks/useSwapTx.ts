import { calculatePercentageOfBigInt, lower, sToMs } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'

interface ParaSwapPricesResponse {
  priceRoute?: {
    bestRoute: object[]
    blockNumber: number
    contractAddress: Address
    contractMethod: string
    destAmount: string
    destDecimals: number
    destToken: string
    destUSD?: string
    gasCost: string
    gasCostL1Wei?: string
    gasCostUSD?: string
    hmac: string
    maxImpactReached: boolean
    network: number
    partner: 'cabana'
    partnerFee: number
    side: 'SELL'
    srcAmount: string
    srcDecimals: number
    srcToken: Address
    srcUSD?: string
    tokenTransferProxy: Address
    version: string
  }
  error?: string
}

interface ParaSwapTxRequestBody {
  srcToken: Address
  srcDecimals: number
  srcAmount: string
  destToken: Address
  destDecimals: number
  slippage: number
  userAddress: Address
  partner: 'cabana'
}

interface ParaSwapTxResponse {
  chainId: number
  data: `0x${string}`
  to: Address
  value: string
}

interface SwapTx {
  target: Address
  value: bigint
  data: `0x${string}`
}

/**
 * Returns transaction data and basic stats about a possible swap transaction
 * @param swapData data necessary to format swap transaction
 * @returns
 */
export const useSwapTx = (swapData: {
  chainId: number
  from: { address: Address; decimals: number; amount: bigint }
  to: { address: Address; decimals: number }
  userAddress: Address
  options?: { slippage?: number }
}) => {
  const { chainId, from, to, userAddress, options } = swapData ?? {}

  const publicClient = usePublicClient({ chainId })

  const slippage = options?.slippage ?? 100

  const enabled =
    !!chainId &&
    !!from &&
    !!from.address &&
    from.decimals !== undefined &&
    !!from.amount &&
    !!to &&
    !!to.address &&
    to.decimals !== undefined &&
    lower(from.address) !== lower(to.address) &&
    !!userAddress &&
    !!publicClient &&
    slippage !== undefined

  const queryKey = [
    'swapTx',
    chainId,
    from?.address,
    from?.decimals,
    from?.amount.toString(),
    to?.address,
    to?.decimals,
    userAddress,
    slippage
  ]

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!!publicClient) {
        const partner = 'cabana'

        const pricesApiUrl = new URL('https://apiv5.paraswap.io/prices')
        pricesApiUrl.searchParams.set('srcToken', from.address)
        pricesApiUrl.searchParams.set('srcDecimals', from.decimals.toString())
        pricesApiUrl.searchParams.set('destToken', to.address)
        pricesApiUrl.searchParams.set('destDecimals', to.decimals.toString())
        pricesApiUrl.searchParams.set('amount', from.amount.toString())
        pricesApiUrl.searchParams.set('side', 'SELL')
        pricesApiUrl.searchParams.set('network', chainId.toString())
        pricesApiUrl.searchParams.set('userAddress', userAddress)
        pricesApiUrl.searchParams.set('partner', partner)

        const pricesApiResponse: ParaSwapPricesResponse = await fetch(pricesApiUrl.toString(), {
          method: 'get'
        })
          .then((r) => r.text())
          .then((t) => JSON.parse(t))

        if (!!pricesApiResponse?.priceRoute) {
          const txApiUrl = new URL(`https://apiv5.paraswap.io/transactions/${chainId}`)
          txApiUrl.searchParams.set('ignoreChecks', 'true')
          txApiUrl.searchParams.set('ignoreGasEstimate', 'true')

          const txApiRequestBody: ParaSwapTxRequestBody = {
            srcToken: from.address,
            srcDecimals: from.decimals,
            srcAmount: from.amount.toString(),
            destToken: to.address,
            destDecimals: to.decimals,
            slippage,
            userAddress,
            partner,
            ...pricesApiResponse
          }

          const txApiResponse: ParaSwapTxResponse = await fetch(txApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(txApiRequestBody)
          })
            .then((r) => r.text())
            .then((t) => JSON.parse(t))

          const tx: SwapTx = {
            target: txApiResponse.to,
            value: BigInt(txApiResponse.value),
            data: txApiResponse.data
          }

          const expectedAmountOut = BigInt(pricesApiResponse.priceRoute.destAmount)
          const minAmountOut = calculatePercentageOfBigInt(expectedAmountOut, 1 - slippage / 1e4)
          const amountOut = { expected: expectedAmountOut, min: minAmountOut }
          const allowanceProxy = pricesApiResponse.priceRoute.tokenTransferProxy

          return { tx, amountOut, allowanceProxy }
        } else {
          throw new Error(pricesApiResponse?.error)
        }
      }
    },
    retry: (failureCount, error) => {
      if (failureCount >= 2) return false

      if (error.message.startsWith('No routes found')) {
        console.error(`"${error.message}" (${chainId} - ${from.address} -> ${to.address})`)
        return false
      }

      return true
    },
    enabled,
    refetchInterval: sToMs(30)
  })
}
