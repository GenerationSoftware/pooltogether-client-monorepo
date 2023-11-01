import { TokenWithAmount, TokenWithSupply } from '@shared/types'
import {
  Address,
  ContractFunctionExecutionError,
  pad,
  PublicClient,
  TypedDataDomain,
  zeroAddress
} from 'viem'
import { erc20ABI } from '../abis/erc20'
import { erc20OldPermitABI } from '../abis/erc20-oldPermit'
import { TOKEN_DATA_REDIRECTS } from '../constants'
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

  if (tokenAddresses?.length > 0) {
    const multicallResults = await getMulticallResults(publicClient, tokenAddresses, erc20ABI, [
      { functionName: 'symbol' },
      { functionName: 'name' },
      { functionName: 'decimals' },
      { functionName: 'totalSupply' }
    ])

    const chainId = await publicClient.getChainId()

    tokenAddresses.forEach((address) => {
      const redirect = TOKEN_DATA_REDIRECTS[chainId]?.[address.toLowerCase()]
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

  if (tokenAddresses?.length > 0) {
    const multicallResults = await getMulticallResults(publicClient, tokenAddresses, erc20ABI, [
      { functionName: 'allowance', args: [address, spenderAddress] }
    ])

    tokenAddresses.forEach((tokenAddress) => {
      formattedResult[tokenAddress] = multicallResults[tokenAddress]?.['allowance'] ?? 0n
    })
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

  if (tokenAddresses?.length > 0) {
    const multicallResults = await getMulticallResults(publicClient, tokenAddresses, erc20ABI, [
      { functionName: 'symbol' },
      { functionName: 'name' },
      { functionName: 'decimals' },
      { functionName: 'balanceOf', args: [address] }
    ])

    const chainId = await publicClient.getChainId()

    tokenAddresses.forEach((tokenAddress) => {
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

  const domain: TypedDataDomain = {
    chainId,
    name: '',
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
    domain.verifyingContract = eip712Domain[4]
    domain.salt = eip712Domain[5]

    return domain
  } catch {
    try {
      const version = await publicClient.readContract({
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'version'
      })

      const name = await publicClient.readContract({
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'name'
      })

      domain.version = version
      domain.name = name

      return domain
    } catch {
      return undefined
    }
  }
}

/**
 * Returns the type of permit a token supports
 * @param publicClient a public Viem client to query through
 * @param tokenAddress token address to check permit support for
 */
export const getTokenPermitSupport = async (
  publicClient: PublicClient,
  tokenAddress: Address
): Promise<'eip2612' | 'daiPermit' | 'none'> => {
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
