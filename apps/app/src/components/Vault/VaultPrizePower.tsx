import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import { useVaultPrizePower } from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import { formatNumberForDisplay } from '@shared/utilities'
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

  if (prizePower === undefined) {
    return <>?</>
  }

  return (
    <>
      {formatNumberForDisplay(prizePower * 100, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}
      %
    </>
  )
}
