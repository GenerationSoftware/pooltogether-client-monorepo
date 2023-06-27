import { isAddress, PublicClient } from 'viem'

// TODO: need better ABI and multicall params/results typing throughout this file

/**
 * Returns the results of a simple multicall where many calls are made to a single contract address
 * @param publicClient a public Viem client to query through
 * @param contractAddress contract address to make calls to
 * @param abi the ABI of the contract provided
 * @param calls the calls to make to the contract
 * @returns
 */
export const getSimpleMulticallResults = async (
  publicClient: PublicClient,
  contractAddress: `0x${string}`,
  abi: any,
  calls: { functionName: string; args?: any[] }[]
): Promise<any[]> => {
  if (!isAddress(contractAddress) || calls.length === 0) {
    throw new Error('Multicall Error: Invalid parameters')
  }

  const chainId = await publicClient?.getChainId()
  if (!chainId) {
    throw new Error('Multicall Error: Could not get chain ID from client')
  }

  const contracts: { address: `0x${string}`; abi: any; functionName: string; args?: any[] }[] = []
  calls.forEach((call) => {
    contracts.push({ address: contractAddress, abi, ...call })
  })

  const results = await publicClient.multicall({ contracts })

  return results.map((result) => result.result)
}

/**
 * Returns the results of a multicall where each call is made to every contract address provided
 * @param publicClient a public Viem client to query through
 * @param contractAddresses contract addresses to make calls to
 * @param abi the ABI of the contracts provided
 * @param calls the calls to make to each contract
 * @returns
 */
export const getMulticallResults = async (
  publicClient: PublicClient,
  contractAddresses: `0x${string}`[],
  abi: any,
  calls: { functionName: string; args?: any[] }[]
): Promise<{
  [contractAddress: `0x${string}`]: {
    [functionName: string]: any
  }
}> => {
  const validAddresses = contractAddresses.every((address) => isAddress(address))
  if (contractAddresses.length === 0 || !validAddresses || calls.length === 0) {
    throw new Error('Multicall Error: Invalid parameters')
  }

  const chainId = await publicClient?.getChainId()
  if (!chainId) {
    throw new Error('Multicall Error: Could not get chain ID from client')
  }

  const contracts: { address: `0x${string}`; abi: any; functionName: string; args?: any[] }[] = []
  calls.forEach((call) => {
    contractAddresses.forEach((contractAddress) => {
      contracts.push({ address: contractAddress, abi, ...call })
    })
  })

  const results = await publicClient.multicall({ contracts })

  const formattedResults: {
    [contractAddress: `0x${string}`]: {
      [functionName: string]: any
    }
  } = {}
  contracts.forEach((contract, i) => {
    if (formattedResults[contract.address] === undefined) {
      formattedResults[contract.address] = {}
    }
    formattedResults[contract.address][contract.functionName] = results[i]?.result
  })

  return formattedResults
}

/**
 * Returns the results of a complex multicall where full call data is provided
 * @param publicClient a public Viem client to query through
 * @param calls the calls to make
 * @returns
 */
export const getComplexMulticallResults = async (
  publicClient: PublicClient,
  calls: { address: `0x${string}`; abi: any; functionName: string; args?: any[] }[]
): Promise<{
  [contractAddress: string]: {
    [functionName: string]: any
  }
}> => {
  const validAddresses = calls.every((call) => isAddress(call.address))
  if (calls.length === 0 || !validAddresses) {
    throw new Error('Multicall Error: Invalid parameters')
  }

  const chainId = await publicClient.getChainId()
  if (!chainId) {
    throw new Error('Multicall Error: Could not get chain ID from client')
  }

  const results = await publicClient.multicall({ contracts: calls })

  const formattedResults: {
    [contractAddress: `0x${string}`]: {
      [functionName: string]: any
    }
  } = {}
  calls.forEach((call, i) => {
    if (formattedResults[call.address] === undefined) {
      formattedResults[call.address] = {}
    }
    formattedResults[call.address][call.functionName] = results[i]?.result
  })

  return formattedResults
}
