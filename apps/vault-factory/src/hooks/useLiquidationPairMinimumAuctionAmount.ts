import { useVault, useVaultSharePrice } from '@generationsoftware/hyperstructure-react-hooks'
import { useMemo } from 'react'
import { SupportedNetwork } from 'src/types'
import { Address, parseUnits } from 'viem'
import { LP_CONFIG } from '@constants/config'

/**
 * Returns a minimum share amount for a liquidation auction to begin
 * @param chainId chain ID of the liquidation pair
 * @param vaultAddress vault address to configure for
 * @returns
 */
export const useLiquidationPairMinimumAuctionAmount = (
  chainId: SupportedNetwork,
  vaultAddress: Address
) => {
  const vault = useVault({ chainId, address: vaultAddress })

  const { data: shareToken, isFetched } = useVaultSharePrice(vault)

  const data = useMemo(() => {
    if (!!shareToken?.price) {
      const numTokens = LP_CONFIG[chainId].minAuctionAmountEth / shareToken.price
      return parseUnits(`${numTokens}`, shareToken.decimals)
    } else if (isFetched) {
      return 0n
    }
  }, [shareToken, isFetched])

  return { data, isFetched }
}
