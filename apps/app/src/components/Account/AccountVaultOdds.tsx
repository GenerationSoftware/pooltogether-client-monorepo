import { formatNumberForDisplay, PrizePool, Vault } from '@pooltogether/hyperstructure-client-js'
import { usePrizeOdds, useUserVaultShareBalance } from '@pooltogether/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import { useTranslations } from 'next-intl'
import { useAccount } from 'wagmi'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'

interface AccountVaultOddsProps {
  vault: Vault
}

export const AccountVaultOdds = (props: AccountVaultOddsProps) => {
  const { vault } = props

  const t = useTranslations('Account')

  const { address: userAddress } = useAccount()

  const { data: shareBalance, isFetched: isFetchedShareBalance } = useUserVaultShareBalance(
    vault,
    userAddress as `0x${string}`
  )

  const prizePools = useSupportedPrizePools()
  const prizePool = Object.values(prizePools).find(
    (prizePool) => prizePool.chainId === vault.chainId
  )

  const { data: prizeOdds, isFetched: isFetchedPrizeOdds } = usePrizeOdds(
    prizePool as PrizePool,
    vault,
    shareBalance?.amount ?? 0n
  )

  if (!userAddress || shareBalance?.amount === 0n) {
    return <>-</>
  }

  if (!isFetchedShareBalance || !isFetchedPrizeOdds) {
    return <Spinner />
  }

  return (
    <>
      {t('oneInXChance', {
        number: formatNumberForDisplay(prizeOdds?.oneInX ?? Number.MAX_SAFE_INTEGER, {
          maximumSignificantDigits: 3
        })
      })}
    </>
  )
}
