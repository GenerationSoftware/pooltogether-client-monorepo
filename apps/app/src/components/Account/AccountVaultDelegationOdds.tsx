import { PrizePool, Vault } from '@pooltogether/hyperstructure-client-js'
import {
  useAllUserVaultDelegationBalances,
  usePrizeOdds
} from '@pooltogether/hyperstructure-react-hooks'
import { Spinner } from '@shared/ui'
import { formatNumberForDisplay } from '@shared/utilities'
import { useTranslations } from 'next-intl'
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

  const { data: delegationBalances, isFetched: isFetchedDelegationBalances } =
    useAllUserVaultDelegationBalances(prizePoolsArray, userAddress as Address)

  const prizePool = Object.values(prizePools).find(
    (prizePool) => prizePool.chainId === vault.chainId
  )

  const delegationBalance =
    delegationBalances?.[vault.chainId]?.[vault.address.toLowerCase() as Address] ?? 0n

  const { data: prizeOdds, isFetched: isFetchedPrizeOdds } = usePrizeOdds(
    prizePool as PrizePool,
    vault,
    delegationBalance
  )

  if (!userAddress || delegationBalance === 0n) {
    return <>-</>
  }

  if (!isFetchedDelegationBalances || !isFetchedPrizeOdds) {
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
