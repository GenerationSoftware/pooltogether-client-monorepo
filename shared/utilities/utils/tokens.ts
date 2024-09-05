import { TokenWithAmount, TokenWithSupply } from '@shared/types'
import {
  Address,
  ContractFunctionExecutionError,
  encodeAbiParameters,
  keccak256,
  pad,
  PublicClient,
  toHex,
  TypedDataDomain,
  zeroAddress
} from 'viem'
import { erc20ABI } from '../abis/erc20'
import { erc20OldPermitABI } from '../abis/erc20-oldPermit'
import {
  DOLPHIN_ADDRESS,
  NATIVE_ASSETS,
  NETWORK,
  POOL_TOKEN_ADDRESSES,
  TOKEN_DATA_REDIRECTS
} from '../constants'
import { lower } from './addresses'
import { getMulticallResults } from './multicall'

/**
 * Returns basic ERC20 token info such as symbol, name, decimals and totalSupply
 * @param publicClient a public Viem client to query through
 * @param tokenAddresses token addresses to query info for
 * @returns
 */
export const getTokenInfo = async (
  publicClient: PublicClient,
  tokenAddresses: Address[]
): Promise<{ [tokenAddress: Address]: TokenWithSupply }> => {
  const formattedResult: { [tokenAddress: Address]: TokenWithSupply } = {}

  const filteredTokenAddresses = tokenAddresses.filter(
    (address) => lower(address) !== DOLPHIN_ADDRESS && address !== zeroAddress
  )

  if (filteredTokenAddresses?.length > 0) {
    const multicallResults = await getMulticallResults(
      publicClient,
      filteredTokenAddresses,
      erc20ABI,
      [
        { functionName: 'symbol' },
        { functionName: 'name' },
        { functionName: 'decimals' },
        { functionName: 'totalSupply' }
      ]
    )

    const chainId = await publicClient.getChainId()

    filteredTokenAddresses.forEach((address) => {
      const redirect = TOKEN_DATA_REDIRECTS[chainId]?.[lower(address)]
      const symbol: string = redirect?.symbol ?? multicallResults[address]?.['symbol']
      const name: string = redirect?.name ?? multicallResults[address]?.['name']
      const decimals = Number(multicallResults[address]?.['decimals'])
      const totalSupply: bigint = multicallResults[address]?.['totalSupply'] ?? 0n

      if (!symbol || Number.isNaN(decimals)) {
        console.warn(`Invalid ERC20 token: ${address} on chain ID ${chainId}.`)
      }

      formattedResult[address] = { chainId, address, symbol, name, decimals, totalSupply }
    })
  }

  if (Object.keys(formattedResult).length < tokenAddresses.length) {
    const lowerCaseTokenAddresses = tokenAddresses.map((address) => lower(address))

    if (lowerCaseTokenAddresses.includes(DOLPHIN_ADDRESS)) {
      const chainId = await publicClient.getChainId()
      const nativeToken = NATIVE_ASSETS[chainId as NETWORK] ?? {}

      formattedResult[DOLPHIN_ADDRESS] = { ...nativeToken, totalSupply: 0n }
    }
  }

  return formattedResult
}

/**
 * Returns an address's token allowance to a specific contract for the provided token addresses
 * @param publicClient a public Viem client to query through
 * @param address address to check allowances for
 * @param spenderAddress the contract address that can potentially spend the allowed tokens
 * @param tokenAddresses token addresses to query allowances for
 * @returns
 */
export const getTokenAllowances = async (
  publicClient: PublicClient,
  address: Address,
  spenderAddress: Address,
  tokenAddresses: Address[]
): Promise<{ [tokenAddress: Address]: bigint }> => {
  const formattedResult: { [tokenAddress: Address]: bigint } = {}

  const filteredTokenAddresses = tokenAddresses.filter(
    (address) => lower(address) !== DOLPHIN_ADDRESS && address !== zeroAddress
  )

  if (filteredTokenAddresses?.length > 0) {
    const multicallResults = await getMulticallResults(
      publicClient,
      filteredTokenAddresses,
      erc20ABI,
      [{ functionName: 'allowance', args: [address, spenderAddress] }]
    )

    filteredTokenAddresses.forEach((tokenAddress) => {
      formattedResult[tokenAddress] = multicallResults[tokenAddress]?.['allowance'] ?? 0n
    })
  }

  if (Object.keys(formattedResult).length < tokenAddresses.length) {
    const lowerCaseTokenAddresses = tokenAddresses.map((address) => lower(address))

    if (lowerCaseTokenAddresses.includes(DOLPHIN_ADDRESS)) {
      formattedResult[DOLPHIN_ADDRESS] = 0n
    }
  }

  return formattedResult
}

/**
 * Returns an address's token balances for the provided token addresses
 * @param publicClient a public Viem client to query through
 * @param address address to check for balances in
 * @param tokenAddresses token addresses to query balances for
 * @returns
 */
export const getTokenBalances = async (
  publicClient: PublicClient,
  address: Address,
  tokenAddresses: Address[]
): Promise<{ [tokenAddress: Address]: TokenWithAmount }> => {
  const formattedResult: { [tokenAddress: Address]: TokenWithAmount } = {}

  const filteredTokenAddresses = tokenAddresses.filter(
    (address) => lower(address) !== DOLPHIN_ADDRESS && address !== zeroAddress
  )

  if (filteredTokenAddresses?.length > 0) {
    const multicallResults = await getMulticallResults(
      publicClient,
      filteredTokenAddresses,
      erc20ABI,
      [
        { functionName: 'symbol' },
        { functionName: 'name' },
        { functionName: 'decimals' },
        { functionName: 'balanceOf', args: [address] }
      ]
    )

    const chainId = await publicClient.getChainId()

    filteredTokenAddresses.forEach((tokenAddress) => {
      const symbol: string = multicallResults[tokenAddress]?.['symbol']
      const name: string = multicallResults[tokenAddress]?.['name']
      const decimals = Number(multicallResults[tokenAddress]?.['decimals'])
      const amount: bigint = multicallResults[tokenAddress]?.['balanceOf'] ?? 0n

      if (!symbol || Number.isNaN(decimals)) {
        console.warn(`Invalid ERC20 token: ${tokenAddress} on chain ID ${chainId}.`)
      }

      formattedResult[tokenAddress] = {
        chainId,
        address: tokenAddress,
        symbol,
        name,
        decimals,
        amount
      }
    })
  }

  if (Object.keys(formattedResult).length < tokenAddresses.length) {
    const lowerCaseTokenAddresses = tokenAddresses.map((address) => lower(address))

    if (lowerCaseTokenAddresses.includes(DOLPHIN_ADDRESS)) {
      const chainId = await publicClient.getChainId()
      const nativeToken = NATIVE_ASSETS[chainId as NETWORK] ?? {}
      const amount = await publicClient.getBalance({ address })

      formattedResult[DOLPHIN_ADDRESS] = { ...nativeToken, amount }
    }
  }

  return formattedResult
}

/**
 * Returns an address's nonces for the provided token address
 *
 * NOTE: Returns -1n if the token does not support the EIP-2612 interface
 * @param publicClient a public Viem client to query through
 * @param address address to check nonces for
 * @param tokenAddress token address to check nonces for
 */
export const getTokenNonces = async (
  publicClient: PublicClient,
  address: Address,
  tokenAddress: Address
) => {
  try {
    return await publicClient.readContract({
      address: tokenAddress,
      abi: erc20ABI,
      functionName: 'nonces',
      args: [address]
    })
  } catch {
    return -1n
  }
}

/**
 * Returns a token's EIP-712 domain
 * @param publicClient a public Viem client to query through
 * @param tokenAddress token address to get domain for
 * @returns
 */
export const getTokenDomain = async (publicClient: PublicClient, tokenAddress: Address) => {
  const chainId = await publicClient.getChainId()

  const name = await publicClient.readContract({
    address: tokenAddress,
    abi: erc20ABI,
    functionName: 'name'
  })

  const domain: TypedDataDomain = {
    chainId,
    name,
    verifyingContract: tokenAddress,
    version: '1'
  }

  try {
    const eip712Domain = await publicClient.readContract({
      address: tokenAddress,
      abi: erc20ABI,
      functionName: 'eip712Domain'
    })

    domain.name = eip712Domain[1]
    domain.version = eip712Domain[2]
  } catch {
    try {
      const version = await publicClient.readContract({
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'version'
      })

      domain.version = version
    } catch {}
  } finally {
    return domain
  }
}

/**
 * Returns the type of permit a token supports
 * @param publicClient a public Viem client to query through
 * @param tokenAddress token address to check permit support for
 * @param options optional settings
 */
export const getTokenPermitSupport = async (
  publicClient: PublicClient,
  tokenAddress: Address,
  options?: { domain?: TypedDataDomain }
): Promise<'eip2612' | 'daiPermit' | 'none'> => {
  if (lower(tokenAddress) === DOLPHIN_ADDRESS) return 'none'

  // TODO: figure out why signatures aren't working for POOL on mainnet
  if (lower(tokenAddress) === lower(POOL_TOKEN_ADDRESSES[NETWORK.mainnet])) return 'none'

  if (!!options?.domain?.chainId && !!options?.domain?.name && !!options?.domain?.version) {
    try {
      const domainSeparator = await publicClient.readContract({
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'DOMAIN_SEPARATOR'
      })

      const domainSeparatorType = [
        { name: 'typeHash', type: 'bytes32' },
        { name: 'nameHash', type: 'bytes32' },
        { name: 'versionHash', type: 'bytes32' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifierAddress', type: 'address' }
      ] as const

      const typeHash = keccak256(
        toHex('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)')
      )
      const nameHash = keccak256(toHex(options.domain.name))
      const versionHash = keccak256(toHex(options.domain.version))
      const chainId = BigInt(options.domain.chainId)

      const computedDomainSeparator = keccak256(
        encodeAbiParameters(domainSeparatorType, [
          typeHash,
          nameHash,
          versionHash,
          chainId,
          tokenAddress
        ])
      )

      if (domainSeparator !== computedDomainSeparator) return 'none'
    } catch {}
  }

  try {
    await publicClient.simulateContract({
      address: tokenAddress,
      abi: erc20ABI,
      functionName: 'permit',
      args: [zeroAddress, zeroAddress, 0n, 0n, 0, pad('0x'), pad('0x')]
    })
  } catch (err) {
    if (
      err instanceof ContractFunctionExecutionError &&
      err.shortMessage.startsWith('The contract function "permit" reverted')
    ) {
      return 'eip2612'
    }

    try {
      await publicClient.simulateContract({
        address: tokenAddress,
        abi: erc20OldPermitABI,
        functionName: 'permit',
        args: [zeroAddress, zeroAddress, 0n, 0n, false, 0, pad('0x'), pad('0x')]
      })
    } catch (err) {
      if (
        err instanceof ContractFunctionExecutionError &&
        err.shortMessage.startsWith('The contract function "permit" reverted')
      ) {
        return 'daiPermit'
      }
    }
  }

  return 'none'
}
