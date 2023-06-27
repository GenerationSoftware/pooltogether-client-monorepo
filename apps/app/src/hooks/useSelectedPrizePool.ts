import { useSelectedVault } from '@pooltogether/hyperstructure-react-hooks'
import { useSupportedPrizePools } from './useSupportedPrizePools'

/**
 * Returns currently selected Prize Pool
 * @returns
 */
export const useSelectedPrizePool = () => {
  const { vault } = useSelectedVault()

  const prizePools = useSupportedPrizePools()

  const selectedPrizePool = !!vault
    ? Object.values(prizePools).find((prizePool) => prizePool.chainId === vault.chainId)
    : Object.values(prizePools)[0]

  return { selectedPrizePool }
}
