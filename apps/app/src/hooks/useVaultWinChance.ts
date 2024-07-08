import { Vault, Vaults } from '@generationsoftware/hyperstructure-client-js'
import {
  useAllVaultPrizeYields,
  useSelectedVaults
} from '@generationsoftware/hyperstructure-react-hooks'
import { getVaultId } from '@shared/utilities'
import { useMemo } from 'react'
import { useSupportedPrizePools } from './useSupportedPrizePools'

/**
 * Returns a relative value from 0 to 1 that represents the chances of winning in a given vault
 * @param vault the vault to calculate win chance for
 * @returns
 */
export const useVaultWinChance = (vault: Vault) => {
  const { vaults: selectedVaults } = useSelectedVaults()

  const vaults = useMemo(() => {
    const isVaultSelected = !!Object.values(selectedVaults.vaults).find(
      (v) => v.id === getVaultId(vault)
    )

    if (isVaultSelected) {
      return selectedVaults
    } else {
      return new Vaults([...selectedVaults.allVaultInfo, vault], selectedVaults.publicClients)
    }
  }, [vault, selectedVaults])

  const prizePools = useSupportedPrizePools()
  const prizePoolsArray = Object.values(prizePools)

  const { data: allVaultPrizeYields, isFetched } = useAllVaultPrizeYields(vaults, prizePoolsArray)

  const data = useMemo(() => {
    const prizeYield = allVaultPrizeYields[vault.id] as number | undefined

    if (prizeYield !== undefined) {
      return Math.sqrt(prizeYield / Math.max(...Object.values(allVaultPrizeYields)))
    }
  }, [vault, allVaultPrizeYields])

  return { data, isFetched }
}
