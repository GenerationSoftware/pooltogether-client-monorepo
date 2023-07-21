import { PRIZE_POOLS } from '@pooltogether/hyperstructure-client-js'
import { Address } from 'viem'
import { useSelectedVaults, useTokenPricesAcrossChains } from '..'

/**
 * Returns token prices for all vaults' underlying tokens
 * @returns
 */
export const useAllVaultTokenPrices = () => {
  const { vaults, isFetched: isFetchedVaultData } = useSelectedVaults()

  const tokenAddresses: { [chainId: number]: Address[] } = {}

  // Adding vault token addresses:
  if (!!vaults.underlyingTokenAddresses) {
    Object.assign(tokenAddresses, vaults.underlyingTokenAddresses.byChain)
  }

  // Adding prize token addresses:
  if (!!vaults.underlyingTokenAddresses) {
    PRIZE_POOLS.forEach((prizePool) => {
      const chainId = prizePool.chainId
      const prizeTokenAddress = prizePool.options.prizeTokenAddress
      if (tokenAddresses[chainId] === undefined) {
        tokenAddresses[chainId] = [prizeTokenAddress]
      } else if (!tokenAddresses[chainId].includes(prizeTokenAddress)) {
        tokenAddresses[chainId].push(prizeTokenAddress)
      }
    })
  }

  const {
    data: tokenPrices,
    isFetched: isFetchedTokenPrices,
    refetch: refetchTokenPrices
  } = useTokenPricesAcrossChains(tokenAddresses)

  const isFetched = isFetchedVaultData && isFetchedTokenPrices

  return { data: tokenPrices, isFetched, refetch: refetchTokenPrices }
}
