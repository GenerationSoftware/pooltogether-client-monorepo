import { isAddress, PublicClient, WalletClient } from 'viem'

/**
 * Throws an error if the address is invalid
 * @param address the address to validate
 * @param source where this function is being called from (ex. "Vault [getTokenData]")
 */
export const validateAddress = (address: string, source?: string) => {
  if (!isAddress(address)) {
    throw new Error(`${!!source ? `${source} | ` : ''}Invalid address: '${address}'`)
  }
}

/**
 * Throws an error if the WalletClient or PublicClient is invalid or for the wrong network
 * @param chainId the chain ID expected
 * @param client the WalletClient or PublicClient to validate
 * @param source where this function is being called from (ex. "Vault [getTokenData]")
 */
export const validateClientNetwork = async (
  chainId: number,
  client: WalletClient | PublicClient,
  source?: string
) => {
  const clientChainId = await client.getChainId()

  if (!clientChainId) {
    throw new Error(`${!!source ? `${source} | ` : ''}Invalid Viem Client`)
  } else if (clientChainId !== chainId) {
    throw new Error(
      `${
        !!source ? `${source} | ` : ''
      }Viem Client is on network ${clientChainId}. Expected network ${chainId}`
    )
  }
}
