import { Vault } from '@pooltogether/hyperstructure-client-js'
import {
  useVaultClaimer,
  useVaultLiquidationPair,
  useVaultTokenData
} from '@pooltogether/hyperstructure-react-hooks'
import { VaultState } from 'src/types'
import { zeroAddress } from 'viem'

/**
 * Returns a vault's current config state
 * @param vault the vault to check state for
 * @returns
 */
export const useDeployedVaultState = (vault: Vault) => {
  const { data: tokenData, isFetched: isFetchedTokenData } = useVaultTokenData(vault)
  const { data: liquidationPair, isFetched: isFetchedLiquidationPair } =
    useVaultLiquidationPair(vault)
  const { data: claimer, isFetched: isFetchedClaimer } = useVaultClaimer(vault)

  const isFetched = isFetchedTokenData && isFetchedLiquidationPair && isFetchedClaimer

  if (!isFetchedTokenData || !isFetchedLiquidationPair || !isFetchedClaimer) {
    return { isFetched }
  }

  let vaultState: VaultState = 'active'

  if (!tokenData) {
    vaultState = 'invalid'
  } else if (!liquidationPair || liquidationPair === zeroAddress) {
    vaultState = 'missingLiquidationPair'
  } else if (!claimer || claimer === zeroAddress) {
    vaultState = 'missingClaimer'
  }

  return { vaultState, isFetched }
}
