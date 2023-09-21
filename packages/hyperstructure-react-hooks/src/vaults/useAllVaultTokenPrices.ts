import { Vaults } from '@generationsoftware/hyperstructure-client-js'
import { PRIZE_POOLS } from '@shared/utilities'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAllVaultTokenAddresses, useTokenPricesAcrossChains } from '..'

/**
 * Returns token prices for all vaults' underlying tokens
 * @param vaults instance of the `Vaults` class
 * @returns
 */
export const useAllVaultTokenPrices = (vaults: Vaults) => {
  const { data: allTokenAddresses, isFetched: isFetchedAllTokenAddresses } =
    useAllVaultTokenAddresses(vaults)

  const tokenAddresses = useMemo(() => {
    const addresses: { [chainId: number]: Address[] } = {}

    if (!!allTokenAddresses) {
      // Adding vault token addresses:
      for (const key in allTokenAddresses.byChain) {
        const chainId = parseInt(key)
        addresses[chainId] = [...allTokenAddresses.byChain[chainId]]
      }

      // Adding prize token addresses:
      PRIZE_POOLS.forEach((prizePool) => {
        const chainId = prizePool.chainId
        const prizeTokenAddress = prizePool.options.prizeTokenAddress
        if (addresses[chainId] === undefined) {
          addresses[chainId] = [prizeTokenAddress]
        } else if (!addresses[chainId].includes(prizeTokenAddress)) {
          addresses[chainId].push(prizeTokenAddress)
        }
      })
    }

    return addresses
  }, [allTokenAddresses])

  const {
    data: tokenPrices,
    isFetched: isFetchedTokenPrices,
    refetch: refetchTokenPrices
  } = useTokenPricesAcrossChains(tokenAddresses)

  const isFetched = isFetchedAllTokenAddresses && isFetchedTokenPrices

  return { data: tokenPrices, isFetched, refetch: refetchTokenPrices }
}
