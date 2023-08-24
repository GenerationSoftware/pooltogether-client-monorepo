import { formatNumberForDisplay, PrizePool, Vault } from '@pooltogether/hyperstructure-client-js'
import { useAllUserBalanceUpdates, usePrizeOdds } from '@pooltogether/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useSupportedPrizePools } from '@hooks/useSupportedPrizePools'

interface AccountVaultDelegationOddsProps {
  vault: Vault
  address?: Address
}

export const AccountVaultDelegationOdds = (props: AccountVaultDelegationOddsProps) => {
  const { vault, address } = props

  const t = useTranslations('Account')

  const { address: _userAddress } = useAccount()
  const userAddress = address ?? _userAddress

  const prizePools = useSupportedPrizePools()
  const prizePoolsArray = Object.values(prizePools)

  const { data: userBalanceUpdates, isFetched: isFetchedUserBalanceUpdates } =
    useAllUserBalanceUpdates(prizePoolsArray, userAddress as Address)

  const delegationAmount = useMemo(() => {
    if (!!userBalanceUpdates) {
      const latestObservation =
        userBalanceUpdates[vault.chainId]?.[vault.address.toLowerCase() as Address]?.[0]
      return !!latestObservation
        ? latestObservation.delegateBalance - latestObservation.balance
        : 0n
    }
  }, [userBalanceUpdates])

  const prizePool = Object.values(prizePools).find(
    (prizePool) => prizePool.chainId === vault.chainId
  )

  const { data: prizeOdds, isFetched: isFetchedPrizeOdds } = usePrizeOdds(
    prizePool as PrizePool,
    vault,
    delegationAmount ?? 0n
  )

  if (!userAddress || delegationAmount === 0n) {
    return <>-</>
  }

  if (!isFetchedUserBalanceUpdates || !isFetchedPrizeOdds) {
    return <Spinner />
  }

  if (prizeOdds === undefined) {
    return <>?</>
  }

  return (
    <>
      {t('oneInXChance', {
        number: formatNumberForDisplay(prizeOdds.oneInX, { maximumSignificantDigits: 3 })
      })}
    </>
  )
}
