import { TokenWithAmount, TokenWithSupply } from '@shared/types'
import { PublicClient } from 'viem'
import { erc20 as erc20Abi } from '../abis/erc20'
import { getMulticallResults } from './multicall'

/**
 * Returns basic ERC20 token info such as symbol, name, decimals and totalSupply
 * @param publicClient a public Viem client to query through
 * @param tokenAddresses token addresses to query info for
 * @returns
 */
export const getTokenInfo = async (
  publicClient: PublicClient,
  tokenAddresses: `0x${string}`[]
): Promise<{ [tokenAddress: `0x${string}`]: TokenWithSupply }> => {
  const formattedResult: { [tokenAddress: `0x${string}`]: TokenWithSupply } = {}

  if (tokenAddresses?.length > 0) {
    const multicallResults = await getMulticallResults(publicClient, tokenAddresses, erc20Abi, [
      { functionName: 'symbol' },
      { functionName: 'name' },
      { functionName: 'decimals' },
      { functionName: 'totalSupply' }
    ])

    const chainId = await publicClient.getChainId()

    tokenAddresses.forEach((address) => {
      const symbol: string = multicallResults[address]?.['symbol']
      const name: string = multicallResults[address]?.['name']
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
  address: `0x${string}`,
  spenderAddress: `0x${string}`,
  tokenAddresses: `0x${string}`[]
): Promise<{ [tokenAddress: `0x${string}`]: bigint }> => {
  const formattedResult: { [tokenAddress: `0x${string}`]: bigint } = {}

  if (tokenAddresses?.length > 0) {
    const multicallResults = await getMulticallResults(publicClient, tokenAddresses, erc20Abi, [
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
  address: `0x${string}`,
  tokenAddresses: `0x${string}`[]
): Promise<{ [tokenAddress: `0x${string}`]: TokenWithAmount }> => {
  const formattedResult: { [tokenAddress: `0x${string}`]: TokenWithAmount } = {}

  if (tokenAddresses?.length > 0) {
    const multicallResults = await getMulticallResults(publicClient, tokenAddresses, erc20Abi, [
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
