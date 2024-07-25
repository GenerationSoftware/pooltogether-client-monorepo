import {
  Address,
  ContractFunctionParameters,
  createPublicClient,
  erc20Abi,
  formatUnits,
  http,
  isAddress
} from 'viem'
import { lpABI } from './abis/lpABI'
import { COVALENT_API_URL, NETWORK_KEYS, RPC_URLS, START_DATE, VIEM_CHAINS } from './constants'
import { ChainTokenPrices, CovalentPricingApiResponse, LpTokens, SUPPORTED_NETWORK } from './types'

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

export const getCurrentDate = () => {
  const date = new Date()

  const yyyy = date.getFullYear()
  let mm = `${date.getMonth() + 1}`
  let dd = `${date.getDate()}`

  if (mm.length === 1) mm = '0' + mm
  if (dd.length === 1) dd = '0' + dd

  return yyyy + '-' + mm + '-' + dd
}

// TODO: should not assume every LP has 2 underlying tokens (could have more)
export const getLpTokenInfo = async (chainId: SUPPORTED_NETWORK, tokenAddresses: Address[]) => {
  const lpTokenInfo: {
    [lpTokenAddress: Address]: {
      token0: { address: Lowercase<Address>; decimals: number; reserve: bigint }
      token1: { address: Lowercase<Address>; decimals: number; reserve: bigint }
      decimals: number
      totalSupply: bigint
    }
  } = {}

  const { value: _cachedLpTokens } = await LP_TOKENS.getWithMetadata(NETWORK_KEYS[chainId])
  const cachedLpTokens = !!_cachedLpTokens ? (JSON.parse(_cachedLpTokens) as LpTokens) : {}

  const publicClient = createPublicClient({
    chain: VIEM_CHAINS[chainId],
    transport: http(RPC_URLS[chainId])
  })

  if (!!publicClient && tokenAddresses.length > 0) {
    const tokenAddressMap: { [lpTokenAddress: Address]: [Address, Address] } = {}

    const tokensToCheck: Address[] = []
    const tokenCalls: ContractFunctionParameters<typeof lpABI>[] = []
    tokenAddresses.forEach((address) => {
      const cachedData = cachedLpTokens[address.toLowerCase() as Lowercase<Address>]
      if (cachedData?.isLp) {
        tokenAddressMap[address] = [cachedData.underlying[0], cachedData.underlying[1]]
      } else if (!cachedData) {
        tokensToCheck.push(address)
        tokenCalls.push({ address, abi: lpABI, functionName: 'token0' })
        tokenCalls.push({ address, abi: lpABI, functionName: 'token1' })
      }
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
        const lpTokenAddress = tokensToCheck[Math.floor(i / 2)]
        tokenAddressMap[lpTokenAddress] = [token0.result, token1.result]
      }
    }

    const lpTokenAddresses = [...new Set<Address>(Object.keys(tokenAddressMap) as Address[])]
    const underlyingTokenAddresses = Object.values(tokenAddressMap)
      .flat()
      .map((address) => address.toLowerCase() as Lowercase<Address>)
    const uniqueUnderlyingTokenAddresses = [
      ...new Set<Lowercase<Address>>(underlyingTokenAddresses)
    ]

    const lpTokenCalls: ContractFunctionParameters<typeof lpABI>[] = []
    lpTokenAddresses.forEach((address) => {
      lpTokenCalls.push({ address, abi: lpABI, functionName: 'decimals' })
      lpTokenCalls.push({ address, abi: lpABI, functionName: 'totalSupply' })
      lpTokenCalls.push({ address, abi: lpABI, functionName: 'reserve0' })
      lpTokenCalls.push({ address, abi: lpABI, functionName: 'reserve1' })
    })

    const underlyingTokenCalls: ContractFunctionParameters<typeof erc20Abi>[] = []
    uniqueUnderlyingTokenAddresses.forEach((address) => {
      underlyingTokenCalls.push({ address, abi: erc20Abi, functionName: 'decimals' })
    })

    const lpTokenResults = await publicClient.multicall({
      contracts: [...lpTokenCalls, ...underlyingTokenCalls]
    })

    const underlyingTokenDecimals: { [tokenAddress: Lowercase<Address>]: number } = {}
    lpTokenResults.slice(lpTokenCalls.length).forEach((data, i) => {
      if (data.status === 'success' && typeof data.result === 'number') {
        underlyingTokenDecimals[uniqueUnderlyingTokenAddresses[i]] = data.result
      }
    })

    lpTokenAddresses.forEach((lpTokenAddress, i) => {
      const token0Address = tokenAddressMap[lpTokenAddress][0].toLowerCase() as Lowercase<Address>
      const token1Address = tokenAddressMap[lpTokenAddress][1].toLowerCase() as Lowercase<Address>

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
          address: Lowercase<Address>
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

export const calcLpTokenPrices = (
  lpTokenInfo: Awaited<ReturnType<typeof getLpTokenInfo>>,
  underlyingTokenPrices: ChainTokenPrices
) => {
  const lpTokenPrices: ChainTokenPrices = {}

  const date = getCurrentDate()

  Object.entries(lpTokenInfo).forEach(([strAddress, info]) => {
    const lpTokenAddress = strAddress as Address

    const token0Address = info.token0.address.toLowerCase() as Lowercase<Address>
    const token1Address = info.token1.address.toLowerCase() as Lowercase<Address>

    const token0Price = underlyingTokenPrices[token0Address]?.[0]?.price
    const token1Price = underlyingTokenPrices[token1Address]?.[0]?.price

    if (!!token0Price && !!token1Price) {
      const token0Amount = parseFloat(formatUnits(info.token0.reserve, info.token0.decimals))
      const token1Amount = parseFloat(formatUnits(info.token1.reserve, info.token1.decimals))
      const token0Value = token0Price * token0Amount
      const token1Value = token1Price * token1Amount

      const lpSupply = parseFloat(formatUnits(info.totalSupply, info.decimals))

      const lpPrice = (token0Value + token1Value) / lpSupply

      lpTokenPrices[lpTokenAddress] = [{ date, price: lpPrice }]
    }
  })

  return lpTokenPrices
}
