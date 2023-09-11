import {
  useGasCostEstimates,
  useVault,
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

  const { data: shareToken, isFetched: isFetchedShareToken } = useVaultSharePrice(vault)

  const { data: gasCostEstimates, isFetched: isFetchedGasCostEstimates } = useGasCostEstimates(
    chainId,
    LP_CONFIG.liquidationGasAmount
  )

  const isFetched = isFetchedShareToken && isFetchedGasCostEstimates

  const minimumAuctionAmount =
    isFetched && !!shareToken && !!gasCostEstimates
      ? parseUnits(
          `${(gasCostEstimates.totalGasEth * 10) / (shareToken.price ?? 0.001)}`,
          shareToken.decimals
        )
      : undefined

  return { data: minimumAuctionAmount, isFetched }
}
