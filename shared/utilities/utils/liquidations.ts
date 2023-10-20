import { Address, isAddress, PublicClient } from 'viem'
import { liquidationPairFactoryABI } from '../abis/liquidationPairFactory'
import { LIQUIDATION_PAIR_FACTORY_ADDRESSES } from '../constants'
import { getSimpleMulticallResults } from './multicall'

/**
 * Returns liquidation pair addresses
 * @param publicClient a public Viem client to query through
 * @returns
 */
export const getLiquidationPairAddresses = async (publicClient: PublicClient) => {
  const lpAddresses = new Set<Address>()

  const chainId = await publicClient.getChainId()

  const lpFactoryAddress = LIQUIDATION_PAIR_FACTORY_ADDRESSES[chainId]

  if (!lpFactoryAddress)
    throw new Error(`No liquidation pair factory address set for chain ID ${chainId}`)

  const totalPairs = await publicClient.readContract({
    address: lpFactoryAddress,
    abi: liquidationPairFactoryABI,
    functionName: 'totalPairs'
  })

  const lpIds = [...Array(Number(totalPairs)).keys()]
  const calls = lpIds.map((lpId) => ({
    functionName: 'allPairs',
    args: [lpId]
  }))

  const multicallResults: (string | undefined)[] = await getSimpleMulticallResults(
    publicClient,
    lpFactoryAddress,
    liquidationPairFactoryABI,
    calls
  )

  multicallResults.forEach((address) => {
    if (!!address && isAddress(address)) {
      lpAddresses.add(address.toLowerCase() as Address)
    }
  })

  return [...lpAddresses]
}
