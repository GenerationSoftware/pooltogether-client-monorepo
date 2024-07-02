import { PrizePool } from '@generationsoftware/hyperstructure-client-js'
import {
  useAllVaultBalances,
  useTokenPrices,
  useVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import { lower } from '@shared/utilities'
import { useMemo } from 'react'
import { Address, formatUnits } from 'viem'
import { useDeployedVaultAddresses } from '@hooks/useDeployedVaultAddresses'

export const useAllVaultTVLsByToken = (prizePool: PrizePool) => {
  const { data: vaultAddresses, isFetched: isFetchedVaultAddresses } =
    useDeployedVaultAddresses(prizePool)

  const vaults = useVaults(
    vaultAddresses?.map((address) => ({ chainId: prizePool.chainId, address })) ?? []
  )

  const { data: vaultTokens, isFetched: isFetchedVaultTokens } = useAllVaultBalances(vaults)
  const vaultTokenAddresses = !!vaultTokens ? Object.values(vaultTokens).map((t) => t.address) : []

  const { data: vaultTokenPrices, isFetched: isFetchedVaultTokenPrices } = useTokenPrices(
    prizePool.chainId,
    vaultTokenAddresses
  )

  const isFetched = isFetchedVaultAddresses && isFetchedVaultTokens && isFetchedVaultTokenPrices

  const data = useMemo(() => {
    if (isFetched) {
      const vaultTvlsByToken: { [tokenAddress: Lowercase<Address>]: number } = {}

      if (!!vaultTokens && !!vaultTokenPrices) {
        Object.values(vaultTokens).forEach((vaultToken) => {
          const tokenAddress = lower(vaultToken.address)
          const tokenAmount = parseFloat(formatUnits(vaultToken.amount, vaultToken.decimals))
          const tokenPrice = vaultTokenPrices[tokenAddress]

          if (!!tokenAmount && !!tokenPrice) {
            if (vaultTvlsByToken[tokenAddress] === undefined) {
              vaultTvlsByToken[tokenAddress] = 0
            }

            vaultTvlsByToken[tokenAddress] += tokenAmount * tokenPrice
          }
        })
      }

      return vaultTvlsByToken
    }
  }, [vaultTokens, vaultTokenPrices, isFetched])

  return { data, isFetched }
}
