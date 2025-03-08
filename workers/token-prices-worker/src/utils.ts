import { DSKit } from 'dskit-eth'
import {
  Address,
  ContractFunctionParameters,
  createPublicClient,
  erc20Abi,
  formatUnits,
  http,
  isAddress
} from 'viem'
import { curveLpABI } from './abis/curveLpABI'
import { lpABI } from './abis/lpABI'
import { NETWORK_KEYS, RPC_URLS, TOKEN_PRICE_REDIRECTS, VIEM_CHAINS } from './constants'
import { ChainTokenPrices, LpTokens, SUPPORTED_NETWORK, UnderlyingToken } from './types'

export const getOnchainTokenPrices = async (
  chainId: SUPPORTED_NETWORK,
  tokenAddresses: Address[]
) => {
  const tokenPrices: ChainTokenPrices = {}

  const tokenPriceQueries: { [chainId: number]: Set<Lowercase<Address>> } = {}
  const querySources: {
    [chainId: number]: { [targetAddress: Lowercase<Address>]: Lowercase<Address>[] }
  } = {}

  tokenAddresses.forEach((address) => {
    const tokenAddress = address.toLowerCase() as Lowercase<Address>

    const redirect = TOKEN_PRICE_REDIRECTS[chainId][tokenAddress]
    const queryTarget = {
      chainId: redirect?.chainId ?? chainId,
      address: redirect?.address ?? tokenAddress
    }

    if (tokenPriceQueries[queryTarget.chainId] === undefined) {
      tokenPriceQueries[queryTarget.chainId] = new Set<Lowercase<Address>>()
    }
    tokenPriceQueries[queryTarget.chainId].add(queryTarget.address)

    if (querySources[queryTarget.chainId] === undefined) {
      querySources[queryTarget.chainId] = {}
    }
    if (querySources[queryTarget.chainId][queryTarget.address] === undefined) {
      querySources[queryTarget.chainId][queryTarget.address] = []
    }
    querySources[queryTarget.chainId][queryTarget.address].push(tokenAddress)
  })

  const date = getCurrentDate()

  await Promise.allSettled(
    Object.entries(tokenPriceQueries).map(([strChainId, _tokenAddresses]) =>
      (async () => {
        const chainId = parseInt(strChainId) as SUPPORTED_NETWORK
        const tokenAddressesArray = [..._tokenAddresses]

        const tokens: { address: Address; decimals: number }[] = []

        const publicClient = createPublicClient({
          chain: VIEM_CHAINS[chainId],
          transport: http(RPC_URLS[chainId])
        })

        const multicall = await publicClient.multicall({
          contracts: tokenAddressesArray.map((address) => ({
            address,
            abi: erc20Abi,
            functionName: 'decimals'
          }))
        })

        multicall.forEach((entry, i) => {
          if (entry.status === 'success' && typeof entry.result === 'number') {
            tokens.push({ address: tokenAddressesArray[i], decimals: entry.result })
          }
        })

        const dskit = new DSKit({ rpcUrl: RPC_URLS[chainId] })

        for (const token of tokens) {
          try {
            const price = await dskit.price.ofToken({ token })
            const sourceTokenAddresses = querySources[chainId][token.address as Lowercase<Address>]

            if (!!price && !!sourceTokenAddresses) {
              sourceTokenAddresses.forEach((sourceTokenAddress) => {
                tokenPrices[sourceTokenAddress] = [{ date, price }]
              })
            }
          } catch (e) {
            console.error(e)
          }
        }
      })()
    )
  )

  return tokenPrices
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

export const getLpTokenInfo = async (chainId: SUPPORTED_NETWORK, tokenAddresses: Address[]) => {
  const lpTokenInfo: {
    [lpTokenAddress: Address]: {
      underlyingTokens: [UnderlyingToken, UnderlyingToken, ...UnderlyingToken[]]
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
    const tokenAddressMap: { [lpTokenAddress: Address]: [Address, Address, ...Address[]] } = {}

    const tokensToCheck: Address[] = []
    const tokenCalls: ContractFunctionParameters<typeof lpABI | typeof curveLpABI>[] = []

    tokenAddresses.forEach((address) => {
      const cachedData = cachedLpTokens[address.toLowerCase() as Lowercase<Address>]

      if (cachedData?.isLp) {
        tokenAddressMap[address] = [...cachedData.underlying]
      } else if (!cachedData) {
        tokensToCheck.push(address)
        tokenCalls.push(
          { address, abi: lpABI, functionName: 'token0' },
          { address, abi: lpABI, functionName: 'token1' },
          { address, abi: curveLpABI, functionName: 'coins', args: [0n] },
          { address, abi: curveLpABI, functionName: 'coins', args: [1n] },
          { address, abi: curveLpABI, functionName: 'coins', args: [2n] },
          { address, abi: curveLpABI, functionName: 'coins', args: [3n] }
        )
      }
    })

    const tokenResults = await publicClient.multicall({ contracts: tokenCalls })

    for (let i = 0; i < tokenResults.length; i += 6) {
      const lpTokenAddress = tokensToCheck[Math.floor(i / 6)]

      const token0 = tokenResults[i]
      const token1 = tokenResults[i + 1]
      const coin0 = tokenResults[i + 2]
      const coin1 = tokenResults[i + 3]
      const coin2 = tokenResults[i + 4]
      const coin3 = tokenResults[i + 5]

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
        tokenAddressMap[lpTokenAddress] = [token0.result, token1.result]
      } else if (isValidTokenResult(coin0) && isValidTokenResult(coin1)) {
        tokenAddressMap[lpTokenAddress] = [coin0.result, coin1.result]
        isValidTokenResult(coin2) && tokenAddressMap[lpTokenAddress].push(coin2.result)
        isValidTokenResult(coin3) && tokenAddressMap[lpTokenAddress].push(coin3.result)
      }
    }

    const lpTokenAddresses = [...new Set<Address>(Object.keys(tokenAddressMap) as Address[])]

    if (!lpTokenAddresses.length) return {}

    const underlyingTokenAddresses = Object.values(tokenAddressMap)
      .flat()
      .map((address) => address.toLowerCase() as Lowercase<Address>)
    const uniqueUnderlyingTokenAddresses = [
      ...new Set<Lowercase<Address>>(underlyingTokenAddresses)
    ]

    const lpTokenCalls: ContractFunctionParameters<typeof lpABI | typeof curveLpABI>[] = []
    lpTokenAddresses.forEach((address) => {
      lpTokenCalls.push(
        { address, abi: lpABI, functionName: 'decimals' },
        { address, abi: lpABI, functionName: 'totalSupply' },
        { address, abi: lpABI, functionName: 'reserve0' },
        { address, abi: lpABI, functionName: 'reserve1' },
        { address, abi: curveLpABI, functionName: 'balances', args: [0n] },
        { address, abi: curveLpABI, functionName: 'balances', args: [1n] },
        { address, abi: curveLpABI, functionName: 'balances', args: [2n] },
        { address, abi: curveLpABI, functionName: 'balances', args: [3n] }
      )
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
      const lpTokenResultIndex = i * 8

      const tokenAddresses = tokenAddressMap[lpTokenAddress].map(
        (address) => address.toLowerCase() as Lowercase<Address>
      )

      const reserves: bigint[] = []
      const reserve0 =
        lpTokenResults[lpTokenResultIndex + 2]?.result ??
        lpTokenResults[lpTokenResultIndex + 4]?.result
      const reserve1 =
        lpTokenResults[lpTokenResultIndex + 3]?.result ??
        lpTokenResults[lpTokenResultIndex + 5]?.result
      const reserve2 = lpTokenResults[lpTokenResultIndex + 6]?.result
      const reserve3 = lpTokenResults[lpTokenResultIndex + 7]?.result

      if (
        !!reserve0 &&
        typeof reserve0 === 'bigint' &&
        !!reserve1 &&
        typeof reserve1 === 'bigint'
      ) {
        reserves.push(reserve0, reserve1)
        !!reserve2 && typeof reserve2 === 'bigint' && reserves.push(reserve2)
        !!reserve3 && typeof reserve3 === 'bigint' && reserves.push(reserve3)
      }

      if (tokenAddresses.length === reserves.length) {
        const tokens = tokenAddresses.map((address, i) => ({
          address,
          decimals: underlyingTokenDecimals[address],
          reserve: reserves[i]
        }))

        const isValidUnderlyingToken = (data?: {
          address: Lowercase<Address>
          decimals: any
          reserve: any
        }): data is UnderlyingToken => {
          return (
            !!data?.address &&
            isAddress(data.address) &&
            typeof data.decimals === 'number' &&
            !!data.reserve &&
            typeof data.reserve === 'bigint'
          )
        }

        if (isValidUnderlyingToken(tokens[0]) && isValidUnderlyingToken(tokens[1])) {
          const decimals = lpTokenResults[lpTokenResultIndex]?.result
          const totalSupply = lpTokenResults[lpTokenResultIndex + 1]?.result

          if (typeof decimals === 'number' && !!totalSupply && typeof totalSupply === 'bigint') {
            const underlyingTokens: [UnderlyingToken, UnderlyingToken, ...UnderlyingToken[]] = [
              tokens[0],
              tokens[1]
            ]
            isValidUnderlyingToken(tokens[2]) && underlyingTokens.push(tokens[2])
            isValidUnderlyingToken(tokens[3]) && underlyingTokens.push(tokens[3])

            lpTokenInfo[lpTokenAddress] = { underlyingTokens, decimals, totalSupply }
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

  Object.entries(lpTokenInfo).forEach(([_lpTokenAddress, info]) => {
    const lpTokenAddress = _lpTokenAddress as Address

    const tokenAddresses = info.underlyingTokens.map(
      (token) => token.address.toLowerCase() as Lowercase<Address>
    )
    const tokenPrices = tokenAddresses.map(
      (address) => underlyingTokenPrices[address]?.[0]?.price ?? 0
    )

    if (tokenPrices.every((price) => !!price)) {
      const tokenAmounts = info.underlyingTokens.map((token) =>
        parseFloat(formatUnits(token.reserve, token.decimals))
      )
      const tokenValues = tokenAmounts.map((amount, i) => amount * tokenPrices[i])

      const lpValue = tokenValues.reduce((a, b) => a + b, 0)
      const lpSupply = parseFloat(formatUnits(info.totalSupply, info.decimals))

      lpTokenPrices[lpTokenAddress] = [{ date, price: lpValue / lpSupply }]
    }
  })

  return lpTokenPrices
}
