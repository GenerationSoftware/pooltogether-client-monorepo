import { BLOCK_EXPLORERS } from '../constants'

/**
 * Returns a block explorer URL for the given token/address/tx/block
 * @param chainId the chain ID for the block explorer
 * @param value value to append to URL (token address, transaction hash, block number, etc.)
 * @param type value type (default is 'address')
 * @returns
 */
export const getBlockExplorerUrl = (
  chainId: number,
  value: string,
  type: 'address' | 'token' | 'tx' | 'block' = 'address'
): string => {
  if (chainId in BLOCK_EXPLORERS) {
    const blockExplorer = BLOCK_EXPLORERS[chainId as keyof typeof BLOCK_EXPLORERS]
    return `${blockExplorer.url}${type}/${value}`
  } else {
    return '#'
  }
}

export const getBlockExplorerName = (chainId: number): string => {
  if (chainId in BLOCK_EXPLORERS) {
    const blockExplorer = BLOCK_EXPLORERS[chainId as keyof typeof BLOCK_EXPLORERS]
    return blockExplorer.name
  } else {
    return '?'
  }
}
