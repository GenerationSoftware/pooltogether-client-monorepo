import { POOL_TOKEN_ADDRESSES } from '../constants'

/**
 * Adds any token to the currently connected MetaMask wallet
 * @param token token to be added to MetaMask
 * @returns
 */
export const addTokenToMetaMask = async (token: {
  address: string
  symbol: string
  decimals: number
  image: string
}) => {
  try {
    // @ts-ignore
    if (!ethereum || !token || !token.address || !token.symbol || !token.decimals || !token.image) {
      throw new Error()
    }

    // @ts-ignore
    return await ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: token
      }
    })
  } catch (error) {
    console.error(error)
  }
}

/**
 * Adds the POOL token to the currently connected MetaMask wallet
 * @param chainId chain ID to add the token to
 * @returns
 */
export const addPoolTokenToMetaMask = async (chainId: number) => {
  if (chainId in POOL_TOKEN_ADDRESSES) {
    return addTokenToMetaMask({
      address: POOL_TOKEN_ADDRESSES[chainId as keyof typeof POOL_TOKEN_ADDRESSES],
      symbol: 'POOL',
      decimals: 18,
      image: 'https://app.pooltogether.com/pooltogether-token-logo@2x.png'
    })
  } else {
    console.error(`No POOL token address found in chain ${chainId}`)
  }
}
