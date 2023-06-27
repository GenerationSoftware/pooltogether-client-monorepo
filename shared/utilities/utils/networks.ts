import { NETWORK } from '../constants'

/**
 * Returns the chain ID that maps to a provided network name
 * @param networkName name that maps to a chain ID
 * @returns
 */
export const getChainIdByName = (networkName: string): number | undefined => {
  // @ts-ignore
  return NETWORK[networkName]
}

/**
 * Returns the network name that maps to a provided chain ID
 * @param chainId chain ID that maps to a network name
 * @returns
 */
export const getNetworkNameByChainId = (chainId: number): string | undefined => {
  const networkKeys = Object.keys(NETWORK) as (keyof typeof NETWORK)[]
  const networkName = networkKeys.find((key) => NETWORK[key] === chainId)

  return networkName
}

/**
 * Returns a formatted network name to display in the UI based on the chain ID provided
 * @param chainId
 * @returns
 */
export const getNiceNetworkNameByChainId = (chainId: number): string => {
  switch (Number(chainId)) {
    case NETWORK.mainnet: {
      return 'Ethereum'
    }
    case NETWORK.bsc: {
      return 'Binance Smart Chain'
    }
    case NETWORK.xdai: {
      return 'xDai'
    }
    case NETWORK['optimism-goerli']: {
      return 'Optimism Goerli'
    }
    case NETWORK['arbitrum-goerli']: {
      return 'Arbitrum Goerli'
    }
    case NETWORK['bsc-testnet']: {
      return 'BSC Testnet'
    }
    case NETWORK['celo-testnet']: {
      return 'Celo Testnet'
    }
    default: {
      const niceName = getNetworkNameByChainId(chainId)
      return niceName ? niceName.charAt(0).toUpperCase() + niceName.slice(1) : '--'
    }
  }
}
