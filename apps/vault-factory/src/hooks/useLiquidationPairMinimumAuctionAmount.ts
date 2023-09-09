import {
  useGasCostEstimates,
  useVault,
  useVaultShareData,
  useVaultSharePrice
} from '@generationsoftware/hyperstructure-react-hooks'
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

  // TODO: this is only necessary since the pricing function returns undefined if price isn't found - needs fix
  const { data: shareData, isFetched: isFetchedShareData } = useVaultShareData(vault)
  const { data: shareToken, isFetched: isFetchedShareToken } = useVaultSharePrice(vault)

  const { data: gasCostEstimates, isFetched: isFetchedGasCostEstimates } = useGasCostEstimates(
    chainId,
    LP_CONFIG.liquidationGasAmount
  )

  const isFetched = isFetchedShareData && isFetchedShareToken && isFetchedGasCostEstimates

  const minimumAuctionAmount =
    isFetched && !!shareData && !!gasCostEstimates
      ? parseUnits(
          `${(gasCostEstimates.totalGasEth * 10) / (shareToken?.price ?? 0.001)}`,
          shareData.decimals
        )
      : undefined

  return { data: minimumAuctionAmount, isFetched }
}
