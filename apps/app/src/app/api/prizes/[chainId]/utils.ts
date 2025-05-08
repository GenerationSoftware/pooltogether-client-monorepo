import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { TokenWithPrice } from '@shared/types'
import { getTokenPrices, lower, PRIZE_POOLS } from '@shared/utilities'
import { NextRequest } from 'next/server'
import { createPublicClient, formatUnits, http, HttpTransportConfig, PublicClient } from 'viem'
import { RPC_URLS, WAGMI_CHAINS } from '@constants/config'
import { PrizesApiParams } from './route'

export const getChainIdFromParams = (params: PrizesApiParams) => {
  const rawChainId =
    !!params.chainId && typeof params.chainId === 'string' ? parseInt(params.chainId) : undefined
  return !!rawChainId &&
    PRIZE_POOLS.map((pool) => pool.chainId).includes(rawChainId) &&
    Object.keys(RPC_URLS)
      .map((k) => parseInt(k))
      .includes(rawChainId)
    ? (rawChainId as keyof typeof RPC_URLS)
    : undefined
}

export const getPublicClient = (
  req: NextRequest,
  chainId: NonNullable<ReturnType<typeof getChainIdFromParams>>
) => {
  const host = req.headers.get('host')
  const httpTransportConfig: HttpTransportConfig | undefined = !!host
    ? { fetchOptions: { headers: { Origin: `https://${host}` } } }
    : undefined

  return createPublicClient({
    chain: WAGMI_CHAINS[chainId],
    transport: http(RPC_URLS[chainId], httpTransportConfig)
  }) as PublicClient
}

export const getPrizePool = (
  chainId: NonNullable<ReturnType<typeof getChainIdFromParams>>,
  publicClient: PublicClient
) => {
  const { address, options } = PRIZE_POOLS.find((pool) => pool.chainId === chainId)!

  const prizePool = new PrizePool(chainId, address, publicClient, options)

  return prizePool
}

export const getPrizesData = async (
  req: NextRequest,
  prizePool: PrizePool,
  options?: { includeCanary?: boolean }
) => {
  const totalPrizesAvailable = await prizePool.getTotalPrizesAvailable()
  const prizeAssetData = await prizePool.getPrizeTokenData()
  const allPrizeInfo = await prizePool.getAllPrizeInfo()

  const host = req.headers.get('host')
  const prices = await getTokenPrices(prizePool.chainId, [prizeAssetData.address], {
    requestHeaders: { Referer: `https://${host}` }
  })
  const prizeAssetPrice = prices[lower(prizeAssetData.address)]

  const formatPrizeAsset = (amount: bigint) =>
    parseFloat(formatUnits(amount, prizeAssetData.decimals))

  const prizeAsset: TokenWithPrice & { amount: number } = {
    chainId: prizePool.chainId,
    address: prizeAssetData.address,
    symbol: prizeAssetData.symbol,
    name: prizeAssetData.name,
    decimals: prizeAssetData.decimals,
    price: prizeAssetPrice,
    amount: formatPrizeAsset(totalPrizesAvailable)
  }

  const prizes = allPrizeInfo
    .slice(0, options?.includeCanary ? undefined : allPrizeInfo.length - 2)
    .map((prizeInfo) => ({
      amount: {
        current: formatPrizeAsset(prizeInfo.amount.current),
        estimated: formatPrizeAsset(prizeInfo.amount.estimated)
      },
      dailyFrequency: prizeInfo.dailyFrequency
    }))

  return { prizeAsset, prizes }
}
