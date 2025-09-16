import { PrizePool, Vault } from '@generationsoftware/hyperstructure-client-js'
import {
  useGpOdds,
  useUserVaultDelegationBalance,
  useUserVaultShareBalance
} from '@generationsoftware/hyperstructure-react-hooks'
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

  const { data: shareBalance, isFetched: isFetchedShareBalance } = useUserVaultShareBalance(
    vault,
    userAddress as Address
  )
  const { data: _delegationBalance, isFetched: isFetchedDelegationBalance } =
    useUserVaultDelegationBalance(vault, userAddress as Address)
  const delegationBalance =
    !!_delegationBalance && !!shareBalance ? _delegationBalance - shareBalance.amount : 0n

  const prizePools = useSupportedPrizePools()
  const prizePool = Object.values(prizePools).find(
    (prizePool) => prizePool.chainId === vault.chainId
  )

  const { data: gpOdds, isFetched: isFetchedGpOdds } = useGpOdds(
    prizePool as PrizePool,
    vault,
    delegationBalance
  )

  if (!userAddress || delegationBalance <= 0n) {
    return <>-</>
  }

  if (!isFetchedShareBalance || !isFetchedDelegationBalance || !isFetchedGpOdds) {
    return <Spinner />
  }

  if (gpOdds === undefined) {
    return <>?</>
  }

  return (
    <>
      {t('oneInXChance', {
        number: formatNumberForDisplay(gpOdds.oneInX, {
          maximumSignificantDigits: 3,
          shortenMillions: true
        })
      })}
    </>
  )
}
