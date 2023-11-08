import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import { useVaultPrizeYield } from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import { formatNumberForDisplay } from '@shared/utilities'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'

interface VaultPrizeYieldProps {
  vault: Vault
}

export const VaultPrizeYield = (props: VaultPrizeYieldProps) => {
  const { vault } = props

  const prizePools = useSupportedPrizePools()

  const prizePool =
    !!vault && Object.values(prizePools).find((prizePool) => prizePool.chainId === vault.chainId)

  const { data: prizeYield, isFetched: isFetchedPrizeYield } = useVaultPrizeYield(
    vault,
    prizePool as PrizePool
  )

  if (!isFetchedPrizeYield) {
    return <Spinner />
  }

  if (prizeYield === undefined) {
    return <>?</>
  }

  const formattedPrizeYield = formatNumberForDisplay(
    prizeYield * 10_000_000 - ((prizeYield * 10_000_000) % 100),
    { maximumFractionDigits: 0 }
  )

  return <>{formattedPrizeYield}</>
}
