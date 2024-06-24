import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import { TokenWithPrice } from '@shared/types'
import { erc20ABI, getTokenPrices, lower, PRIZE_POOLS, prizePoolABI } from '@shared/utilities'
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
  chainId: NonNullable<ReturnType<typeof getChainIdFromParams>>,
  req: NextRequest
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
  prizePool: PrizePool,
  options?: { includeCanary?: boolean }
) => {
  const firstMulticallResults = await prizePool.publicClient.multicall({
    contracts: [
      { address: prizePool.address, abi: prizePoolABI, functionName: 'prizeToken' },
      { address: prizePool.address, abi: prizePoolABI, functionName: 'reserve' },
      { address: prizePool.address, abi: prizePoolABI, functionName: 'pendingReserveContributions' }
    ],
    batchSize: 1_024 * 1_024
  })

  const prizeAssetAddress = firstMulticallResults[0].result!
  const reserveAmount = firstMulticallResults[1].result!
  const pendingReserveAmount = firstMulticallResults[2].result!

  const secondMulticallResults = await prizePool.publicClient.multicall({
    contracts: [
      { address: prizeAssetAddress, abi: erc20ABI, functionName: 'symbol' },
      { address: prizeAssetAddress, abi: erc20ABI, functionName: 'name' },
      { address: prizeAssetAddress, abi: erc20ABI, functionName: 'decimals' },
      {
        address: prizeAssetAddress,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [prizePool.address]
      }
    ],
    batchSize: 1_024 * 1_024
  })

  const prizeAssetSymbol = secondMulticallResults[0].result!
  const prizeAssetName = secondMulticallResults[1].result!
  const prizeAssetDecimals = secondMulticallResults[2].result!
  const prizeAssetAmount = secondMulticallResults[3].result!

  const allPrizeInfo = await prizePool.getAllPrizeInfo()

  const prices = await getTokenPrices(prizePool.chainId, [prizeAssetAddress])
  const prizeAssetPrice = prices[lower(prizeAssetAddress)]

  const formatPrizeAsset = (amount: bigint) => parseFloat(formatUnits(amount, prizeAssetDecimals))

  const prizeAsset: TokenWithPrice & { amount: number } = {
    chainId: prizePool.chainId,
    address: prizeAssetAddress,
    symbol: prizeAssetSymbol,
    name: prizeAssetName,
    decimals: prizeAssetDecimals,
    price: prizeAssetPrice,
    amount: formatPrizeAsset(prizeAssetAmount - reserveAmount - pendingReserveAmount)
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
