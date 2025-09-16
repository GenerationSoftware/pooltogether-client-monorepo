import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import { calculateGpOdds } from '@shared/utilities'
import { useGrandPrizePeriodDraws, useVaultPercentageContribution, useVaultShareData } from '..'

/**
 * Returns the odds of winning the GP within any one draw for a specific vault, given a specific share balance
 * @param prizePool instance of the `PrizePool` class
 * @param vault instance of the `Vault` class
 * @param shares share amount to calculate odds for
 * @param options optional settings
 * @returns
 */
export const useGpOdds = (
  prizePool: PrizePool,
  vault: Vault,
  shares: bigint,
  options?: { isCumulative?: boolean }
): { data?: { percent: number; oneInX: number }; isFetched: boolean } => {
  const { data: shareData, isFetched: isFetchedShareData } = useVaultShareData(vault)

  const { data: vaultContribution, isFetched: isFetchedVaultContribution } =
    useVaultPercentageContribution(prizePool, vault)

  const { data: gpPeriodDraws, isFetched: isFetchedGpPeriodDraws } =
    useGrandPrizePeriodDraws(prizePool)

  const isFetched = isFetchedShareData && isFetchedVaultContribution && isFetchedGpPeriodDraws
  const isSuccess = !!shareData && vaultContribution !== undefined && gpPeriodDraws !== undefined

  const percent =
    isSuccess && !!shares && shares > 0n
      ? calculateGpOdds(
          shares,
          shareData.totalSupply + (options?.isCumulative ? shares : 0n),
          shareData.decimals,
          vaultContribution,
          gpPeriodDraws
        )
      : 0

  const oneInX = 1 / percent

  const data = isFetched && isSuccess ? { percent, oneInX } : undefined

  return { data, isFetched }
}
