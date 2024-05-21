import { sToMs } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { usePublicClient } from 'wagmi'

interface ParaSwapPricesResponse {
  priceRoute: {
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

export const useSwapTx = (swapData: {
  chainId: number
  from: { address: Address; decimals: number; amount: bigint }
  to: { address: Address; decimals: number }
  sender: Address
  options?: { slippage?: number }
}) => {
  const { chainId, from, to, sender, options } = swapData ?? {}

  const publicClient = usePublicClient({ chainId })

  const enabled =
    !!chainId &&
    !!from &&
    !!from.address &&
    from.decimals !== undefined &&
    !!from.amount &&
    !!to &&
    !!to.address &&
    to.decimals !== undefined &&
    !!sender &&
    !!publicClient &&
    !!process.env.NEXT_PUBLIC_DECENT_API_KEY

  const queryKey = [
    'swapTx',
    chainId,
    from?.address,
    from?.decimals,
    from?.amount.toString(),
    to?.address,
    to?.decimals,
    sender,
    options?.slippage
  ]

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!!publicClient) {
        const pricesApiUrl = new URL('https://apiv5.paraswap.io/prices')
        pricesApiUrl.searchParams.set('srcToken', from.address)
        pricesApiUrl.searchParams.set('srcDecimals', from.decimals.toString())
        pricesApiUrl.searchParams.set('destToken', to.address)
        pricesApiUrl.searchParams.set('destDecimals', to.decimals.toString())
        pricesApiUrl.searchParams.set('amount', from.amount.toString())
        pricesApiUrl.searchParams.set('side', 'SELL')
        pricesApiUrl.searchParams.set('network', chainId.toString())
        pricesApiUrl.searchParams.set('userAddress', sender)
        pricesApiUrl.searchParams.set('partner', 'cabana')

        const pricesApiResponse: ParaSwapPricesResponse = await fetch(pricesApiUrl.toString(), {
          method: 'get'
        })
          .then((r) => r.text())
          .then((t) => JSON.parse(t))

        const txApiUrl = new URL(`https://apiv5.paraswap.io/transactions/${chainId}`)
        txApiUrl.searchParams.set('ignoreChecks', 'true')
        txApiUrl.searchParams.set('ignoreGasEstimate', 'true')

        const txApiRequestBody: ParaSwapTxRequestBody = {
          srcToken: from.address,
          srcDecimals: from.decimals,
          srcAmount: from.amount.toString(),
          destToken: to.address,
          destDecimals: to.decimals,
          slippage: options?.slippage ?? 100,
          userAddress: sender,
          partner: 'cabana',
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

        // TODO: check that this actually corresponds to min amount out
        const minAmountOut = BigInt(pricesApiResponse.priceRoute.destAmount)

        return { tx, minAmountOut }
      }
    },
    enabled,
    staleTime: sToMs(60)
  })
}
