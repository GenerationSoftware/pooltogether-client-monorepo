import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  usePrizeTokenData,
  useVaultContributionAmount
} from '@generationsoftware/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import { formatBigIntForDisplay } from '@shared/utilities'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'

interface VaultContributionsProps {
  vault: Vault
}

export const VaultContributions = (props: VaultContributionsProps) => {
  const { vault } = props

  const prizePools = useSupportedPrizePools()

  const prizePool =
    !!vault && Object.values(prizePools).find((prizePool) => prizePool.chainId === vault.chainId)

  const { data: contributedAmount, isFetched: isFetchedContributedAmount } =
    useVaultContributionAmount(prizePool as PrizePool, vault)

  const { data: prizeToken, isFetched: isFetchedPrizeToken } = usePrizeTokenData(
    prizePool as PrizePool
  )

  if (!isFetchedContributedAmount || !isFetchedPrizeToken) {
    return <Spinner />
  }

  if (contributedAmount === undefined || !prizeToken) {
    return <>?</>
  }

  return (
    <div className='flex gap-1 items-center'>
      <span>
        {formatBigIntForDisplay(contributedAmount, prizeToken.decimals, { hideZeroes: true })}
      </span>
      <span className='text-sm text-pt-purple-200'>{prizeToken.symbol}</span>
    </div>
  )
}
