import { formatNumberForDisplay, PrizePool, Vault } from '@pooltogether/hyperstructure-client-js'
import { useVaultPrizePower } from '@pooltogether/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'

interface VaultPrizePowerProps {
  vault: Vault
}

export const VaultPrizePower = (props: VaultPrizePowerProps) => {
  const { vault } = props

  const prizePools = useSupportedPrizePools()

  const prizePool =
    !!vault && Object.values(prizePools).find((prizePool) => prizePool.chainId === vault.chainId)

  const { data: prizePower, isFetched: isFetchedPrizePower } = useVaultPrizePower(
    vault,
    prizePool as PrizePool
  )

  if (!isFetchedPrizePower) {
    return <Spinner />
  }

  return (
    <>
      {formatNumberForDisplay((prizePower ?? 0) * 100, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}
    </>
  )
}
