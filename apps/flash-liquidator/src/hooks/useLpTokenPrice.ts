import { Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useToken,
  useTokenPrices,
  useVaultSharePrice
} from '@generationsoftware/hyperstructure-react-hooks'
import { NO_REFETCH } from '@shared/generic-react-hooks'
import { TokenWithPrice } from '@shared/types'
import { vaultABI } from '@shared/utilities'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { LiquidationPair } from 'src/types'
import { Address, isAddress } from 'viem'
import { usePublicClient } from 'wagmi'

/**
 * Returns the price of the first token in a liquidation pair's swap path
 * @param liquidationPair the liquidation pair to get token price from
 * @returns
 */
export const useLpTokenPrice = (
  liquidationPair: LiquidationPair
): { data?: TokenWithPrice; isFetched: boolean } => {
  const chainId = liquidationPair?.chainId
  const tokenAddress = liquidationPair?.swapPath[0]

  const publicClient = usePublicClient({ chainId })

  const { data: token, isFetched: isFetchedToken } = useToken(chainId, tokenAddress as Address)

  const { data: isVault, isFetched: isFetchedIsVault } = useQuery(
    ['isLpTokenAVault', chainId, tokenAddress],
    async () => {
      try {
        const asset = await publicClient.readContract({
          address: tokenAddress,
          abi: vaultABI,
          functionName: 'asset'
        })
        return !!asset ? isAddress(asset) : false
      } catch {
        return false
      }
    },
    {
      enabled: !!publicClient && !!tokenAddress,
      ...NO_REFETCH
    }
  )

  const vault = useMemo(() => {
    if (!!tokenAddress && isFetchedIsVault && isVault) {
      return new Vault(chainId, tokenAddress, publicClient)
    }
  }, [chainId, publicClient, tokenAddress, isFetchedIsVault, isVault])
  const { data: shareTokenWithPrice } = useVaultSharePrice(vault as Vault)

  const { data: tokenPrices, isFetched: isFetchedTokenPrices } = useTokenPrices(
    chainId,
    !!tokenAddress ? [tokenAddress] : []
  )

  const isFetched = isFetchedToken && isFetchedTokenPrices

  if (!!token) {
    if (!!shareTokenWithPrice?.price) {
      return { data: shareTokenWithPrice, isFetched }
    } else if (!!tokenPrices && !!token) {
      return {
        data: { ...token, price: tokenPrices[tokenAddress.toLowerCase() as Address] },
        isFetched
      }
    }
  }

  return { isFetched }
}
