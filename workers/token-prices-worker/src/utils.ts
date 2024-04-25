import {
  Address,
  ContractFunctionParameters,
  createPublicClient,
  erc20Abi,
  http,
  isAddress
} from 'viem'
import { lpABI } from './abis/lpABI'
import { COVALENT_API_URL, RPC_URLS, START_DATE, VIEM_CHAINS } from './constants'
import { ChainTokenPrices, CovalentPricingApiResponse, SUPPORTED_NETWORK } from './types'

export const getCovalentTokenPrices = async (
  chainId: SUPPORTED_NETWORK,
  tokenAddresses: Address[],
  options?: { from?: string }
) => {
  try {
    const strTokenAddresses = tokenAddresses.join(',')
    const url = new URL(
      `${COVALENT_API_URL}/pricing/historical_by_addresses_v2/${chainId}/eth/${strTokenAddresses}/`
    )
    url.searchParams.set('key', COVALENT_API_KEY)
    url.searchParams.set('from', options?.from ?? START_DATE)
    const response = await fetch(url.toString())
    const tokenPricesArray = (await response.json<{ data: CovalentPricingApiResponse[] }>()).data
    const tokenPrices: ChainTokenPrices = {}
    tokenPricesArray.forEach((token) => {
      const tokenAddress = token.contract_address.toLowerCase() as Address
      token.prices.forEach((day) => {
        if (day.price !== null) {
          if (tokenPrices[tokenAddress] === undefined) {
            tokenPrices[tokenAddress] = []
          }
          tokenPrices[tokenAddress].push({ date: day.date, price: day.price })
        }
      })
    })
    return tokenPrices
  } catch (e) {
    console.error(e)
    return {}
  }
}

export const sortTokenPricesByDate = (
  tokenPrices: { date: string; price: number }[],
  direction: 'asc' | 'desc' = 'desc'
) => {
  return [...tokenPrices].sort((a, b) => {
    const aDate = new Date(a.date)
    const bDate = new Date(b.date)

    return direction === 'desc'
      ? bDate.getTime() - aDate.getTime()
      : aDate.getTime() - bDate.getTime()
  })
}

// TODO: should not assume every LP has 2 underlying tokens (could have more)
export const getLpTokenInfo = async (chainId: SUPPORTED_NETWORK, tokenAddresses: Address[]) => {
  const lpTokenInfo: {
    [lpTokenAddress: Address]: {
      token0: { address: Address; decimals: number; reserve: bigint }
      token1: { address: Address; decimals: number; reserve: bigint }
      decimals: number
      totalSupply: bigint
    }
  } = {}

  const publicClient = createPublicClient({
    chain: VIEM_CHAINS[chainId],
    transport: http(RPC_URLS[chainId])
  })

  if (!!publicClient && tokenAddresses.length > 0) {
    const tokenAddressMap: { [lpTokenAddress: Address]: [Address, Address] } = {}

    const tokenCalls: ContractFunctionParameters<typeof lpABI>[] = []
    tokenAddresses.forEach((address) => {
      tokenCalls.push({ address, abi: lpABI, functionName: 'token0' })
      tokenCalls.push({ address, abi: lpABI, functionName: 'token1' })
    })

    const tokenResults = await publicClient.multicall({ contracts: tokenCalls })

    for (let i = 0; i < tokenResults.length; i += 2) {
      const token0 = tokenResults[i]
      const token1 = tokenResults[i + 1]

      const isValidTokenResult = (
        data: (typeof tokenResults)[number]
      ): data is { status: 'success'; result: Address } => {
        return (
          data.status === 'success' &&
          !!data.result &&
          typeof data.result === 'string' &&
          isAddress(data.result)
        )
      }

      if (isValidTokenResult(token0) && isValidTokenResult(token1)) {
        const lpTokenAddress = tokenAddresses[Math.floor(i / 2)]
        tokenAddressMap[lpTokenAddress] = [token0.result, token1.result]
      }
    }

    const lpTokenAddresses = [...new Set<Address>(Object.keys(tokenAddressMap) as Address[])]
    const underlyingTokenAddresses = [...new Set<Address>(...Object.values(tokenAddressMap))]

    const lpTokenCalls: ContractFunctionParameters<typeof lpABI>[] = []
    lpTokenAddresses.forEach((address) => {
      lpTokenCalls.push({ address, abi: lpABI, functionName: 'decimals' })
      lpTokenCalls.push({ address, abi: lpABI, functionName: 'totalSupply' })
      lpTokenCalls.push({ address, abi: lpABI, functionName: 'reserve0' })
      lpTokenCalls.push({ address, abi: lpABI, functionName: 'reserve1' })
    })

    const underlyingTokenCalls: ContractFunctionParameters<typeof erc20Abi>[] = []
    underlyingTokenAddresses.forEach((address) => {
      underlyingTokenCalls.push({ address, abi: erc20Abi, functionName: 'decimals' })
    })

    const lpTokenResults = await publicClient.multicall({
      contracts: [...lpTokenCalls, ...underlyingTokenCalls]
    })

    const underlyingTokenDecimals: { [tokenAddress: Address]: number } = {}
    lpTokenResults.slice(lpTokenCalls.length).forEach((data, i) => {
      if (data.status === 'success' && typeof data.result === 'number') {
        underlyingTokenDecimals[underlyingTokenAddresses[i]] = data.result
      }
    })

    lpTokenAddresses.forEach((lpTokenAddress, i) => {
      const token0Address = tokenAddressMap[lpTokenAddress][0]
      const token1Address = tokenAddressMap[lpTokenAddress][1]

      if (!!token0Address && !!token1Address) {
        const token0 = {
          address: token0Address,
          decimals: underlyingTokenDecimals[token0Address],
          reserve: lpTokenResults[i * 4 + 2]?.result
        }
        const token1 = {
          address: token1Address,
          decimals: underlyingTokenDecimals[token1Address],
          reserve: lpTokenResults[i * 4 + 3]?.result
        }

        const isValidToken = (data: {
          address: Address
          decimals: any
          reserve: any
        }): data is (typeof lpTokenInfo)[Address]['token0'] => {
          return (
            typeof data.decimals === 'number' && !!data.reserve && typeof data.reserve === 'bigint'
          )
        }

        if (isValidToken(token0) && isValidToken(token1)) {
          const decimals = lpTokenResults[i * 4]?.result
          const totalSupply = lpTokenResults[i * 4 + 1]?.result

          if (typeof decimals === 'number' && !!totalSupply && typeof totalSupply === 'bigint') {
            lpTokenInfo[lpTokenAddress] = { token0, token1, decimals, totalSupply }
          }
        }
      }
    })
  }

  return lpTokenInfo
}
